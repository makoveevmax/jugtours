package com.okta.developer.jugtours;

import com.okta.developer.jugtours.model.Event;
import com.okta.developer.jugtours.model.Group;
import com.okta.developer.jugtours.model.GroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.stream.Stream;

@Component
class Initializer implements CommandLineRunner {

    private final GroupRepository repository;

    public Initializer(GroupRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) {
        Stream.of("Joker SPb", "DevOops SPb").forEach(name ->
                repository.save(new Group(name))
        );

        Group jug = repository.findByName("Joker SPb");
        Event e = Event.builder().title("Java conference for Seniors and Team Lead's")
                .description("Concurrency, testing, highloads")
                .date(Instant.parse("2019-10-25T18:00:00.000Z"))
                .build();
        jug.setEvents(Collections.singleton(e));
        repository.save(jug);

        repository.findAll().forEach(System.out::println);
    }
}