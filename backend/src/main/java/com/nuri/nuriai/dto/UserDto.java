package com.nuri.nuriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nuri.nuriai.domain.User;
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
    public static class UserResponse {
        private Long id;
        private String userId;
        private String userNickname;
        private Integer userClassAge;

        public UserResponse(User user) {
            this.id = user.getId();
            this.userId = user.getUserId();
            this.userNickname = user.getUserNickname();
            this.userClassAge = user.getUserClassAge();
        }
    }
}
