package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String userPwd;
    private String userNickname;
    private Integer userClassAge;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder
    public User (String userId, String userPwd, String userNickname, Integer userClassAge) {
        this.userId = userId;
        this.userPwd = userPwd;
        this.userNickname = userNickname;
        this.userClassAge = userClassAge;
        this.role = (role == null) ? Role.USER : role;
    }
}
