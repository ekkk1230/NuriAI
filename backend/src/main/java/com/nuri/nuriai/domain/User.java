package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<RecentView> recentViews;

    @Builder
    public User (String userId, String userPwd, String userNickname, Integer userClassAge, String email, Role role) {
        this.userId = userId;
        this.userPwd = userPwd;
        this.userNickname = userNickname;
        this.userClassAge = userClassAge;
        this.email = email;
        this.role = (role == null) ? Role.USER : role;
    }

    public void changePassword(String newPassword) {
        this.userPwd = newPassword;
    }
}
