package com.nuri.nuriai.service;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.UserDto;
import com.nuri.nuriai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
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

    public UserDto.UserResponse loginUser(String userId, String password) {
        User loginUser = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원 ID입니다. " + userId));

        if (!passwordEncoder.matches(password, loginUser.getUserPwd())) {
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
}
