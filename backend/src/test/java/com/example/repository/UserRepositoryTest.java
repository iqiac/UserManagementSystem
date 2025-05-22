package com.example.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.entity.User;

@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUser() {
        User user = new User("Alice", "alice@example.com");
        User savedUser = userRepository.save(user);

        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getName()).isEqualTo("Alice");
        assertThat(savedUser.getEmail()).isEqualTo("alice@example.com");
        assertThat(userRepository.findById(savedUser.getId())).contains(savedUser);
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User("Alice", "alice@example.com");
        User user2 = new User("Bob", "bob@example.com");
        userRepository.save(user1);
        userRepository.save(user2);

        List<User> users = userRepository.findAll();

        assertThat(users).hasSize(2);
        assertThat(users).contains(user1, user2);
    }

    @Test
    void testGetUserById() {
        User user = new User("Alice", "alice@example.com");
        userRepository.save(user);

        Optional<User> result = userRepository.findById(user.getId());

        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(user);
    }

    @Test
    void testUpdateUser() {
        User user = new User("Alice", "alice@example.com");
        userRepository.save(user);

        user.setName("Bob");
        User updatedUser = userRepository.save(user);

        assertThat(updatedUser.getId()).isNotNull();
        assertThat(updatedUser.getName()).isEqualTo("Bob");
        assertThat(updatedUser.getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void testDeleteUser() {
        User user = new User("Alice", "alice@example.com");
        userRepository.save(user);

        userRepository.deleteById(user.getId());

        assertThat(userRepository.findById(user.getId())).isEmpty();
    }
}
