package com.nuri.nuriai.service;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.RecentViewDto;
import com.nuri.nuriai.repository.RecentViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecentViewService {
    private final RecentViewRepository recentViewRepository;

    public List<RecentViewDto.Response> getRecentViews(User user) {
        return recentViewRepository.findByUserOrderByViewedAtDesc(user).stream()
                .map(RecentViewDto.Response::new)
                .collect(Collectors.toList());
    }
}
