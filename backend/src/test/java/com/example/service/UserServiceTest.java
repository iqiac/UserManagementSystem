package com.example.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.entity.User;
import com.example.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(new User("Alice", "alice@example.com")));

        List<User> users = userService.getAllUsers();

        assertThat(users).hasSize(1);
        assertThat(users.get(0).getName()).isEqualTo("Alice");
        assertThat(users.get(0).getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void testGetUserById() {
        User user = new User("Alice", "alice@example.com");
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(1L);

        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(user);
    }

    @Test
    void testSaveUser() {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = new User("Alice", "alice@example.com");
        User savedUser = userService.saveUser(user);

        assertThat(savedUser).isEqualTo(user);
    }

    @Test
    void testUpdateUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        Optional<User> result = userService.updateUser(1L, new User("Alice", "alice@example.com"));

        assertThat(result).isEmpty();
    }

    @Test
    void testUpdateUser() {
        User user = new User("Bob", "bob@example.com");
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<User> result = userService.updateUser(1L, new User("Alice", "alice@example.com"));

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Alice");
        assertThat(result.get().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void testDeleteUser() {
        User user = new User("Alice", "alice@example.com");
        userRepository.save(user);

        userService.deleteUser(1L);

        assertThat(userRepository.findById(1L)).isEmpty();
    }
}
