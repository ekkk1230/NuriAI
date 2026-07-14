package com.nuri.nuriai.service;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.UserDto;
import com.nuri.nuriai.repository.PlanLikeRepository;
import com.nuri.nuriai.repository.PlanRepository;
import com.nuri.nuriai.repository.PlanSaveRepository;
import com.nuri.nuriai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

    public UserDto.FindResponse findUserPwd(String userId, String email) {
        User user = userRepository.findByUserIdAndEmail(userId, email).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원 정보 입니다."));

        return UserDto.FindResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .build();

    }
}
