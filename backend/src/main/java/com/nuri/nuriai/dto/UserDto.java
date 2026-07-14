package com.nuri.nuriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nuri.nuriai.domain.Role;
import com.nuri.nuriai.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserDto {
    @Getter
    @NoArgsConstructor
    public static class UserRequest {
        @JsonProperty("userId")
        private String userId;
        @JsonProperty("userPwd")
        private String userPwd;
        @JsonProperty("userNickname")
        private String userNickname;
        @JsonProperty("userClassAge")
        private Integer userClassAge;
    }

    @Getter
    @NoArgsConstructor
    public static class LoginRequest {
        @JsonProperty("userId")
        private String userId;
        @JsonProperty("userPwd")
        private String userPwd;
    }

    @Getter
    public static class LoginResponse {
        private UserResponse user;
        private String accessToken;

        public LoginResponse(UserResponse user, String accessToken) {
            this.user = user;
            this.accessToken = accessToken;
        }
    }

    @Getter
    public static class UserResponse {
        private Long id;
        private String userId;
        private String userNickname;
        private Integer userClassAge;
        private Role role;

        public UserResponse(User user) {
            this.id = user.getId();
            this.userId = user.getUserId();
            this.userNickname = user.getUserNickname();
            this.userClassAge = user.getUserClassAge();
            this.role = user.getRole();
        }
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class FindResponse {
        private Long id;
        private String userId;
    }

    @Getter
    @NoArgsConstructor
    public static class FindRequest {
        private String userId;
        private String email;
    }
}
