// Player.java

import java.awt.Point;
import java.util.ArrayList;
import java.util.List;

public class Players {
    private String name;
    private Point position;
    private List<String> inventory;
    private int score;

    public Players(String name) {
        this.name = name;
        this.position = new Point(0, 0); // Starting position
        this.inventory = new ArrayList<>();
        this.score = 0;
    }

    public void move(String direction) {
    }

    public void addItem(String item) {
    }

    public void useItem(String item) {
    }

    public void updateScore(int points) {
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public Point getPosition() {
        return new Point(position);
    }

    public List<String> getInventory() {
        return new ArrayList<>(inventory);
    }

    public int getScore() {
        return score;
    }
}