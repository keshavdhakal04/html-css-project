// CosmicWizardMaze.java

import javax.swing.SwingUtilities;

public class CosmicWizardMaze {
    public static void main(String[] args) {
        // Initialize the backend logic (currently empty)
        CosmicWizardMazeLogic logic = new CosmicWizardMazeLogic();

        // Initialize and display the GUI, passing the backend logic
        SwingUtilities.invokeLater(() -> {
            CosmicWizardMazeGUI gui = new CosmicWizardMazeGUI(logic);
            gui.createAndShowGUI();
        });
    }
}
