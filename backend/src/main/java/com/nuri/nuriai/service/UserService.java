package com.nuri.nuriai.service;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.UserDto;
import com.nuri.nuriai.repository.PlanLikeRepository;
import com.nuri.nuriai.repository.PlanRepository;
import com.nuri.nuriai.repository.PlanSaveRepository;
import com.nuri.nuriai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PlanRepository planRepository;
    private final PlanLikeRepository planLikeRepository;
    private final PlanSaveRepository planSaveRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Transactional
    public UserDto.UserResponse joinUser(UserDto.UserRequest request) {
        String encodedPassword = passwordEncoder.encode(request.getUserPwd());

        User newUser = User.builder()
                .userId(request.getUserId())
                .userPwd(encodedPassword)
                .userNickname(request.getUserNickname())
                .userClassAge(request.getUserClassAge())
                .build();

        userRepository.save(newUser);
        return new UserDto.UserResponse(newUser);
    }

    public UserDto.UserResponse loginUser(UserDto.LoginRequest request) {
        User loginUser = userRepository.findByUserId(request.getUserId()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원 ID입니다. " + request.getUserId()));

        System.out.println("조회된 닉네임: " + loginUser.getUserNickname());

        if (!passwordEncoder.matches(request.getUserPwd(), loginUser.getUserPwd())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return new UserDto.UserResponse(loginUser);
    }

    public boolean confirmValue(String type, String value) {
        if (type.equals("userId")) {
            return userRepository.existsByUserId(value);
        } else if (type.equals("userNickname")) {
            return userRepository.existsByUserNickname(value);
        }

        throw new IllegalArgumentException("잘못된 중복 확인 타입입니다: " + type);
    }

    public UserDto.UserResponse getCurrentUser(String userId) {
        System.out.println("조회하려는 userId: " + userId);
        User findUser = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원 정보 입니다."));
        return new UserDto.UserResponse(findUser);
    }

    @Transactional
    public void withdrawUser(User user) {
        String nickname = user.getUserNickname();
        String deletedUserNickname = "탈퇴한 사용자";

        planLikeRepository.deleteByUser(user);
        planSaveRepository.deleteByUser(user);

        planRepository.updateAuthorName(nickname, deletedUserNickname);
        userRepository.delete(user);

        log.info("사용자 탈퇴 완료: {}, 작성한 글 처리", nickname);
    }

    public UserDto.FindResponse findUserId(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원 이메일 입니다."));

        return UserDto.FindResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .build();

    }

    @Transactional
    public void findUserPwd(String userId, String email) {
        User user = userRepository.findByUserIdAndEmail(userId, email).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원 정보 입니다."));

        String newPassword = UUID.randomUUID().toString().substring(0, 8);

        user.changePassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("임시 비밀번호 안내");
        message.setText("발급된 임시 비밀번호는 " + newPassword + " 입니다.");
        try {
            mailSender.send(message);
            log.info("메일 발송 완료");
        } catch (Exception e) {
            log.error("메일 발송 중 에러 발생: ", e);
        }
    }

    public boolean checkPwd(String password, User user) {
        String originalPwd = user.getUserPwd();
        return passwordEncoder.matches(password, originalPwd);
    }

    @Transactional
    public boolean changePwd(String password, User user) {
        User foundUser = userRepository.findByUserId(user.getUserId()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        System.out.println("변경할 비밀번호: " + password);
        try {
            foundUser.changePassword(passwordEncoder.encode(password));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
