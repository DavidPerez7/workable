package com.workable_sb.workable.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;

@Service
public class LogService {

    public static class LogEntry {
        // use epoch millis (long) to avoid JavaTime serialization issues in some environments
        public long timestamp;
        public String level;
        public String source; // BACKEND or FRONTEND
        public String message;
        public String details;

        public LogEntry() {}
        public LogEntry(String level, String source, String message, String details) {
            this.timestamp = System.currentTimeMillis();
            this.level = level;
            this.source = source;
            this.message = message;
            this.details = details;
        }
    }

    private final Deque<LogEntry> recent = new LinkedList<>();
    private final int MAX = 200;

    public synchronized void add(String level, String source, String message, String details) {
        LogEntry e = new LogEntry(level, source, message, details);
        recent.addFirst(e);
        while (recent.size() > MAX) recent.removeLast();
    }

    public synchronized List<LogEntry> recent() {
        return Collections.unmodifiableList(new ArrayList<>(recent));
    }
}
