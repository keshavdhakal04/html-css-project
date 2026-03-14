import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import javax.swing.*;

/**
 * The CosmicWizardMazeGUI class represents the graphical user interface for the Cosmic Wizard's Maze game.
 * It creates and manages the game's visual components, including the game board, player information,
 * action buttons, and various game controls.
 */
public class CosmicWizardMazeGUI {
	
	/**
     * The size of the game grid.
     */
	private static final int GRID_SIZE = 7;
	/**
     * Constructs a new CosmicWizardMazeGUI object.
     *
     * @param logic The CosmicWizardMazeLogic object that handles the game's backend logic.
     */
	public CosmicWizardMazeGUI(CosmicWizardMazeLogic logic) {
		// TODO Auto-generated constructor stub
	}
	
	/**
     * Creates and displays the main game window with all its components.
     * This method sets up the frame, adds various panels, and organizes the layout of the game interface.
     */
	void createAndShowGUI() {
		JFrame frame = new JFrame("Cosmic Wizard's Maze");
		frame.getContentPane().setPreferredSize(new Dimension(1215, 720));

		// Create and set the custom background panel
		JPanel backgroundPanel = createBackgroundPanel();
		frame.setContentPane(backgroundPanel); // Set the content pane to the background panel
		backgroundPanel.setLayout(new GridBagLayout()); // Set layout for the background panel
		frame.setSize(1215, 720); 
        frame.setResizable(false);

		GridBagConstraints gbc = new GridBagConstraints();

		// ============================
		// 1. Logo Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 0;
		gbc.gridy = 0;
		gbc.weightx = 3;                            // Default for weightx
		gbc.weighty = 3;  
		gbc.anchor = GridBagConstraints.NORTHWEST;
		backgroundPanel.add(createLogoPanel(), gbc);

		// ============================
		// 2. Players' Names Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 0;
		gbc.gridy = 1;
		gbc.weightx = 2;                            // Default for weightx
		gbc.weighty = 2; 
		gbc.fill = GridBagConstraints.HORIZONTAL; // Same fill as Logo Panel
		backgroundPanel.add(createPlayerPanel(), gbc);

		// ============================
		// 3. Game Options Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 0;
		gbc.gridy = 2;
		gbc.weightx = 2;                            // Default for weightx
		gbc.weighty = 2; 
		gbc.fill = GridBagConstraints.HORIZONTAL; // Same fill
		backgroundPanel.add(createActionPanel(), gbc);

		// ============================
		// 4. Settings Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 0;
		gbc.gridy = 3;
		//gbc.fill = GridBagConstraints.HORIZONTAL; // Same fill
		backgroundPanel.add(createSettingsPanel(), gbc);

		// ============================
		// 5. Maze Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 2;
		gbc.gridy = 1;
		gbc.gridheight = 3; // Span multiple rows
		gbc.weightx = 0.6;
		gbc.weighty = 1.0;
		gbc.fill = GridBagConstraints.BOTH;
		backgroundPanel.add(createMazePanel(), gbc);

		// ============================
		// 6. Top Buttons Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 2;
		gbc.gridy = 0;
		gbc.gridheight = 1;
		gbc.weightx = 0.6;
		gbc.weighty = 0.1;
		gbc.fill = GridBagConstraints.HORIZONTAL;
		backgroundPanel.add(createTopButtonsPanel(), gbc);

		// ============================
		// 7. Bottom Buttons Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 2;
		gbc.gridy = 4;
		gbc.gridheight = 1;
		gbc.weightx = 0.6;
		gbc.weighty = 0.1;
		gbc.fill = GridBagConstraints.HORIZONTAL;
		backgroundPanel.add(createBottomButtonsPanel(), gbc);

		// ============================
		// 8. Left Vertical Buttons Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 1;
		gbc.gridy = 1;
		gbc.gridheight = 3;
		gbc.weightx = 0.1;
		gbc.weighty = 0.6;
		gbc.fill = GridBagConstraints.VERTICAL;
		backgroundPanel.add(createLeftVerticalButtonsPanel(), gbc);

		// ============================
		// 9. Right Vertical Buttons Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 3;
		gbc.gridy = 1;
		gbc.gridheight = 3;
		gbc.weightx = 0.1;
		gbc.weighty = 0.6;
		gbc.fill = GridBagConstraints.VERTICAL;
		backgroundPanel.add(createRightVerticalButtonsPanel(), gbc);

		// ============================
		// 10. Control Panel
		// ============================
		resetGBC(gbc);
		gbc.gridx = 4;
		gbc.gridy = 1;
		gbc.gridheight = 1;
		gbc.weightx = 0.2;
		gbc.weighty = 0.1;
		gbc.fill = GridBagConstraints.HORIZONTAL;
		backgroundPanel.add(createControlPanel(), gbc);

		// ============================
		// 11. Text Box
		// ============================
		resetGBC(gbc);
		gbc.gridx = 4;
		gbc.gridy = 2;
		gbc.gridheight = 1;
		gbc.weightx = 0.2;
		gbc.weighty = 0.9;
		gbc.fill = GridBagConstraints.BOTH;
		backgroundPanel.add(createChatPanel(), gbc);

		// Finalize and display the frame
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.pack();
		frame.setVisible(true);
	}


	/**
     * Creates and returns the logo panel for the game.
     *
     * @return A JPanel containing the game's logo.
     */
	private static JPanel createLogoPanel() {
		// Create Logo Panel
		ImageIcon logoIcon = new ImageIcon("Assets//gameLogo.png");
		JLabel gameLogo = new JLabel();
		gameLogo.setIcon(logoIcon);
		gameLogo.setPreferredSize(new Dimension(50, 50));  // Set fixed size for the logo

		JPanel logoPanel = new JPanel();
		logoPanel.setOpaque(false);
		logoPanel.add(gameLogo);
		logoPanel.setLayout(new GridBagLayout());
		return logoPanel;
	}

	/**
     * Creates and returns the player information panel.
     *
     * @return A JPanel displaying information about the current players.
     */
	private static JPanel createPlayerPanel() {
		// Players Names Panel
		JPanel playerPanel = new JPanel();
		playerPanel.setOpaque(false);
		playerPanel.setLayout(new GridLayout(5, 1, 7, 7));
		JLabel nowPlaying = new JLabel("Now Playing:");
		playerPanel.add(nowPlaying);

		ImageIcon playerBorder = new ImageIcon("Assets//PlayerBorder.png");
		
		String[] players = {"PLAYER 1", "PLAYER 2", "PLAYER 3", "PLAYER 4"};
		for (String player : players) {
			JLabel playerLabel = new JLabel(player, playerBorder, JLabel.CENTER);
			playerLabel.setHorizontalTextPosition(SwingConstants.CENTER);  // Center the text horizontally
			playerLabel.setVerticalTextPosition(SwingConstants.CENTER);    // Center the text vertically (on top of the image)
			
			// Step 4: Customize the text appearance
			playerLabel.setFont(new Font("Arial", Font.BOLD, 16));  // Set a bold font with size 20
			playerLabel.setForeground(Color.WHITE);                 // Set the text color to white (for contrast)
			playerLabel.setHorizontalAlignment(JLabel.CENTER);      // Center the content in the label

			playerPanel.add(playerLabel);
		}
		return playerPanel;
	}

	/**
     * Creates and returns the action panel containing game option buttons.
     *
     * @return A JPanel with buttons for various game actions.
     */
	public static JPanel createActionPanel() {
        // Game Options Panel with 4 rows and 2 columns
        JPanel actionPanel = new JPanel(new GridLayout(4, 2, 1, 4));
        actionPanel.setOpaque(false);

        // Load images for the buttons (make sure the file paths are correct)
        ImageIcon useWandIcon = new ImageIcon("Assets//Option.png");
        ImageIcon collectedItemsIcon = new ImageIcon("Assets//Option.png");
        ImageIcon secretCardIcon = new ImageIcon("Assets//Option.png");
        ImageIcon skipTurnIcon = new ImageIcon("Assets//Option.png");

        // Resize the icons to fit the buttons (optional, adjust size as needed)
        Image useWandImg = useWandIcon.getImage().getScaledInstance(50, 50, Image.SCALE_SMOOTH);
        Image collectedItemsImg = collectedItemsIcon.getImage().getScaledInstance(50, 50, Image.SCALE_SMOOTH);
        Image secretCardImg = secretCardIcon.getImage().getScaledInstance(50, 50, Image.SCALE_SMOOTH);
        Image skipTurnImg = skipTurnIcon.getImage().getScaledInstance(50, 50, Image.SCALE_SMOOTH);

        // Create ImageIcons from the resized images
        useWandIcon = new ImageIcon(useWandImg);
        collectedItemsIcon = new ImageIcon(collectedItemsImg);
        secretCardIcon = new ImageIcon(secretCardImg);
        skipTurnIcon = new ImageIcon(skipTurnImg);

        // First row: Button with image and Label for "USE WAND"
        JButton useWandButton = new JButton(useWandIcon);
        useWandButton.setContentAreaFilled(false);
        useWandButton.setBorderPainted(false);
        useWandButton.setHorizontalTextPosition(SwingConstants.CENTER);
        useWandButton.setVerticalTextPosition(SwingConstants.BOTTOM);
        JLabel useWandLabel = new JLabel("USE WAND");

        // Second row: Button with image and Label for "COLLECTED ITEMS"
        JButton collectedItemsButton = new JButton(collectedItemsIcon);
        collectedItemsButton.setContentAreaFilled(false);
        collectedItemsButton.setBorderPainted(false);
        collectedItemsButton.setHorizontalTextPosition(SwingConstants.CENTER);
        collectedItemsButton.setVerticalTextPosition(SwingConstants.BOTTOM);
        JLabel collectedItemsLabel = new JLabel("COLLECTED ITEMS");

        // Third row: Button with image and Label for "SECRET CARD"
        JButton secretCardButton = new JButton(secretCardIcon);
        secretCardButton.setContentAreaFilled(false);
        secretCardButton.setBorderPainted(false);
        secretCardButton.setHorizontalTextPosition(SwingConstants.CENTER);
        secretCardButton.setVerticalTextPosition(SwingConstants.BOTTOM);
        JLabel secretCardLabel = new JLabel("SECRET CARD");

        // Fourth row: Button with image and Label for "SKIP TURN"
        JButton skipTurnButton = new JButton(skipTurnIcon);
        skipTurnButton.setContentAreaFilled(false);
        skipTurnButton.setBorderPainted(false);
        skipTurnButton.setHorizontalTextPosition(SwingConstants.CENTER);
        skipTurnButton.setVerticalTextPosition(SwingConstants.BOTTOM);
        JLabel skipTurnLabel = new JLabel("SKIP TURN");

        // Add buttons and labels to the panel
        actionPanel.add(useWandButton);       // Column 1, Row 1 (Button)
        actionPanel.add(useWandLabel);        // Column 2, Row 1 (Label)

        actionPanel.add(collectedItemsButton); // Column 1, Row 2 (Button)
        actionPanel.add(collectedItemsLabel);  // Column 2, Row 2 (Label)

        actionPanel.add(secretCardButton);     // Column 1, Row 3 (Button)
        actionPanel.add(secretCardLabel);      // Column 2, Row 3 (Label)

        actionPanel.add(skipTurnButton);       // Column 1, Row 4 (Button)
        actionPanel.add(skipTurnLabel);        // Column 2, Row 4 (Label)

        return actionPanel;
    }

	/**
	 * Creates and returns the settings panel with a "Settings" button that opens a submenu.
	 *
	 * @return A JPanel containing the settings button and its associated submenu.
	 */
	private static JPanel createSettingsPanel() {
	    JPanel settingsPanel = new JPanel(new GridLayout(1, 2, 4, 4));
	    settingsPanel.setOpaque(false);

	    ImageIcon settingsButtonIcon = new ImageIcon("Assets//Settings.png");
	    
	    Image settingsButtonImg = settingsButtonIcon.getImage().getScaledInstance(50, 50, Image.SCALE_SMOOTH);
	    
	    settingsButtonIcon = new ImageIcon(settingsButtonImg);
	    // First row: Button and Label for "USE WAND"
	    JButton settingsButton = new JButton(settingsButtonIcon);
	    settingsButton.setContentAreaFilled(false);
	    settingsButton.setBorderPainted(false);
	    settingsButton.setToolTipText("Open game settings");
	    JLabel settingsButtonLabel = new JLabel("Settings");


	    // Create a popup menu for settings options
	    JPopupMenu settingsMenu = new JPopupMenu();

	    // Add menu items to the popup menu
	    addMenuItem(settingsMenu, "New Game");
	    addMenuItem(settingsMenu, "Save Game");
	    addMenuItem(settingsMenu, "Volume");
	    addMenuItem(settingsMenu, "Tutorials");
	    settingsMenu.addSeparator();
	    addMenuItem(settingsMenu, "Exit Game");
	    // Add action listener to the settings button
	    settingsButton.addActionListener(e -> {
	        // Show the popup menu below the settings button
	        settingsMenu.show(settingsButton, 0, settingsButton.getHeight());
	    });

	    settingsPanel.add(settingsButton);
	    settingsPanel.add(settingsButtonLabel);
	    return settingsPanel;
	}

	/**
	 * Helper method to add a menu item to a popup menu.
	 *
	 * @param menu The JPopupMenu to add the item to.
	 * @param text The text of the menu item.
	 * @param action The ActionListener for the menu item.
	 */
	private static void addMenuItem(JPopupMenu menu, String text) {
	    JMenuItem menuItem = new JMenuItem(text);
	    menuItem.addActionListener(null);
	    menu.add(menuItem);
	}

	/**
     * Creates and returns the main maze panel representing the game board.
     *
     * @return A JPanel containing the game's maze grid.
     */
	private static JPanel createMazePanel() {
		// Maze Panel
		JPanel mazePanel = new JPanel(new GridLayout(GRID_SIZE, GRID_SIZE));
		for (int row = 0; row < GRID_SIZE; row++) {
			for (int col = 0; col < GRID_SIZE; col++) {
				JLabel gridLabel = new JLabel("", SwingConstants.CENTER);
				gridLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
				gridLabel.setPreferredSize(new Dimension(100, 100));
				mazePanel.add(gridLabel);
			}
		}

		addPermanentTiles(mazePanel);
		addRandomTiles(mazePanel);
		return mazePanel;
	}

	/**
     * Creates and returns a custom panel with a background image for the game.
     *
     * @return A JPanel with a custom painted background.
     */
	private static JPanel createBackgroundPanel() {
		// Create a panel with a custom background image
		return new JPanel() {
			private final Image backgroundImage = new ImageIcon("Assets\\backgroundImage.png").getImage(); // Adjust the path as needed

			@Override
			protected void paintComponent(Graphics g) {
				super.paintComponent(g);
				g.drawImage(backgroundImage, 0, 0, getWidth(), getHeight(), this); // Draw the image
			}
		};
	}

	/**
     * Adds permanent tiles to the maze panel at predefined positions.
     *
     * @param mazePanel The JPanel representing the maze to which tiles will be added.
     */
	private static void addPermanentTiles(JPanel mazePanel) {
		// Create an array with image paths and grid positions
		Object[][] tileData = {
				{"Assets\\L1.png", 0, 0},
				{"Assets\\T2.png", 2, 0}, {"Assets\\T2.png", 4, 0},
				{"Assets\\L2.png", 6, 0},
				{"Assets\\T1.png", 0, 2}, {"Assets\\T1.png", 0, 4},
				{"Assets\\T2-sp.png", 2, 2},
				{"Assets\\T3-sp.png", 4, 2},
				{"Assets\\T3.png", 6, 2}, {"Assets\\T3.png", 6, 4},
				{"Assets\\T1-sp.png", 2, 4},
				{"Assets\\T4-sp.png", 4, 4},
				{"Assets\\L4.png", 0, 6},
				{"Assets\\T4.png", 2, 6}, {"Assets\\T4.png", 4, 6},
				{"Assets\\L3.png", 6, 6}
		};

		// Loop through the tileData and add labels with the images to the mazePanel
		for (Object[] tile : tileData) {
			String imagePath = (String) tile[0];
			int gridX = (int) tile[1];
			int gridY = (int) tile[2];

			// Load and scale the image to fit the grid cell
			ImageIcon originalIcon = new ImageIcon(imagePath);
			Image scaledImage = originalIcon.getImage().getScaledInstance(100, 100, Image.SCALE_SMOOTH);
			ImageIcon scaledIcon = new ImageIcon(scaledImage);

			JLabel tileLabel = new JLabel(scaledIcon);
			tileLabel.setHorizontalAlignment(JLabel.CENTER);
			tileLabel.setVerticalAlignment(JLabel.CENTER);
			tileLabel.setPreferredSize(new Dimension(100, 100));  // Set the preferred size of each tile

			// Add the tile to the maze at the specified grid position
			int index = gridY * GRID_SIZE + gridX;  // Calculate the position index in the GridLayout
			mazePanel.remove(index);  // Remove the empty cell at the position
			mazePanel.add(tileLabel, index);  // Add the image tile to that position
		}

		mazePanel.revalidate();  // Refresh the panel to show the updated tiles
		mazePanel.repaint();     // Redraw the panel
	}

	/**
     * Adds random tiles to the maze panel at available positions.
     *
     * @param mazePanel The JPanel representing the maze to which random tiles will be added.
     */
	private static void addRandomTiles(JPanel mazePanel) {
		// Define the list of positions as (x, y) pairs
		String[] positionStrings = {
				"10", "30", "50",
				"01", "11", "21", "31", "41", "51", "61",
				"12", "32", "52",
				"03", "13", "23", "33", "43", "53", "63",
				"14", "34", "54",
				"05", "15", "25", "35", "45", "55", "65",
				"16", "36", "56"
		};

		List<Point> positions = new ArrayList<>();
		for (String posStr : positionStrings) {
			int x = Character.getNumericValue(posStr.charAt(0));
			int y = Character.getNumericValue(posStr.charAt(1));
			positions.add(new Point(x, y));
		}

		// Define the tile types with their counts
		List<String> tileTypes = new ArrayList<>();

		// Add 3 random tiles from L_tiles
		String[] L_tiles = {"L1.png", "L2.png", "L3.png", "L4.png"};

	    // Shuffle the array to get random order
	    List<String> shuffledLTiles = Arrays.asList(L_tiles);
	    Collections.shuffle(shuffledLTiles);

	    // Add 3 random tiles from the shuffled list
	    for (int i = 0; i < 15; i++) {
	        // Ensure we only get existing tiles even if there are fewer than 3 tiles available
	        tileTypes.add(shuffledLTiles.get(i % shuffledLTiles.size())); // Using modulo to cycle if needed
	    }

		// Add 1 random tile from T_tiles
		String[] T_tiles = {"T1.png", "T2.png", "T3.png", "T4.png"};
		String T_tile = T_tiles[new Random().nextInt(T_tiles.length)];
		tileTypes.add(T_tile);

		// Add 2 tiles of "x-initial.png"
		for (int i = 0; i < 2; i++) {
			tileTypes.add("x-initial.jpg");
		}

		// Add 7 tiles of "straight-vertical.png"
		for (int i = 0; i < 7; i++) {
			tileTypes.add("straight-vertical.png");
		}

		// Add 8 tiles of "straight-horizontal.png"
		for (int i = 0; i < 8; i++) {
			tileTypes.add("straight-horizontal.png");
		}

		// Shuffle the tileTypes list to ensure random placement
		Collections.shuffle(tileTypes);

		// Shuffle the positions list to randomize tile assignment
		Collections.shuffle(positions);

		// Assign tiles to positions
		for (int i = 0; i < tileTypes.size(); i++) {
			if (i >= positions.size()) {
				break; // No more positions to assign tiles
			}
			Point p = positions.get(i);
			int x = p.x;
			int y = p.y;
			int index = y * GRID_SIZE + x;

			// Load and scale the image
			ImageIcon originalIcon = new ImageIcon("Assets/" + tileTypes.get(i));
			Image scaledImage = originalIcon.getImage().getScaledInstance(100, 100, Image.SCALE_SMOOTH);
			ImageIcon scaledIcon = new ImageIcon(scaledImage);

			// Create a new label with the image
			JLabel tileLabel = new JLabel(scaledIcon);
			tileLabel.setHorizontalAlignment(JLabel.CENTER);
			tileLabel.setVerticalAlignment(JLabel.CENTER);

			// Remove the existing placeholder label at this index, if any
			mazePanel.remove(index); // Remove the placeholder label
			mazePanel.add(tileLabel, index); // Add the tile label
		}

		// Refresh the mazePanel to display the new tiles
		mazePanel.revalidate();
		mazePanel.repaint();
	}


	/**
	 * Resizes an ImageIcon to the specified width and height.
	 *
	 * @param icon   The original ImageIcon to be resized.
	 * @param width  The desired width of the resized icon.
	 * @param height The desired height of the resized icon.
	 * @return A new ImageIcon with the specified dimensions.
	 */
	private static ImageIcon resizeIcon(ImageIcon icon, int width, int height) {
		Image img = icon.getImage().getScaledInstance(width, height, Image.SCALE_SMOOTH);
		return new ImageIcon(img);
	}

	/**
	 * Creates and returns the top buttons panel for the game board.
	 *
	 * @return A JPanel containing buttons for the top of the game board.
	 */
	private static JPanel createTopButtonsPanel() {
		// Top Buttons Panel
		JPanel topHorizontalButtonPanel = new JPanel(new GridLayout(1, 7, 10, 10));
		topHorizontalButtonPanel.setOpaque(false);
		// Load the image icon for buttons and resize it
		ImageIcon buttonIcon = resizeIcon(new ImageIcon("Assets/switch-button(top to down).png"), 35, 35); // Adjust size as needed

		// Add empty spaces for the 1st, 3rd, 5th, and 7th columns
		topHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 1
		JButton button1 = new JButton(buttonIcon);
		button1.setContentAreaFilled(false);
		button1.setBorderPainted(false);
		button1.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		topHorizontalButtonPanel.add(button1); // Column 2
		topHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 3
		
		JButton button2 = new JButton(buttonIcon);
		button2.setContentAreaFilled(false);
		button2.setBorderPainted(false);
		button2.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		topHorizontalButtonPanel.add(button2); // Column 4
		topHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 5
		
		JButton button3 = new JButton (buttonIcon);
		button3.setContentAreaFilled(false);
		button3.setBorderPainted(false);
		button3.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		topHorizontalButtonPanel.add(button3); // Column 6
		topHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 7

		return topHorizontalButtonPanel;
	}

	/**
	 * Creates and returns the bottom buttons panel for the game board.
	 *
	 * @return A JPanel containing buttons for the bottom of the game board.
	 */
	private static JPanel createBottomButtonsPanel() {
		// Bottom Buttons Panel
		JPanel bottomHorizontalButtonPanel = new JPanel(new GridLayout(1, 7, 10, 10));
		bottomHorizontalButtonPanel.setOpaque(false);

		// Load the image icon for buttons and resize it
		ImageIcon buttonIcon = resizeIcon(new ImageIcon("Assets/switch-button(down to top).png"), 35, 35); // Adjust size as needed

		// Add empty spaces for the 1st, 3rd, 5th, and 7th columns
		bottomHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 1
		JButton button1 = new JButton(buttonIcon);
		button1.setContentAreaFilled(false);
		button1.setBorderPainted(false);
		button1.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		bottomHorizontalButtonPanel.add(button1); // Column 2
		bottomHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 3
		
		JButton button2 = new JButton(buttonIcon);
		button2.setContentAreaFilled(false);
		button2.setBorderPainted(false);
		button2.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		bottomHorizontalButtonPanel.add(button2); // Column 4
		bottomHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 5
		
		JButton button3 = new JButton(buttonIcon);
		button3.setContentAreaFilled(false);
		button3.setBorderPainted(false);
		button3.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		bottomHorizontalButtonPanel.add(button3); // Column 6
		bottomHorizontalButtonPanel.add(Box.createHorizontalStrut(0)); // Column 7

		return bottomHorizontalButtonPanel;
	}

	/**
	 * Creates and returns the left vertical buttons panel for the game board.
	 *
	 * @return A JPanel containing buttons for the left side of the game board.
	 */
	private static JPanel createLeftVerticalButtonsPanel() {
		// Left Side Buttons Panel
		JPanel leftVerticalButtonPanel = new JPanel(new GridLayout(7, 1, 10, 10));
		leftVerticalButtonPanel.setOpaque(false);

		// Load the image icon for buttons and resize it
		ImageIcon buttonIcon = resizeIcon(new ImageIcon("Assets/switch-button(left to right).png"), 35, 35); // Adjust size as needed

		// Add empty spaces for the 1st, 3rd, 5th, and 7th rows
		leftVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 1
		JButton button1 = new JButton(buttonIcon);
		button1.setContentAreaFilled(false);
		button1.setBorderPainted(false);
		button1.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		leftVerticalButtonPanel.add(button1); // Row 2
		leftVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 3
		
		JButton button2 = new JButton(buttonIcon);
		button2.setContentAreaFilled(false);
		button2.setBorderPainted(false);
		button2.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		leftVerticalButtonPanel.add(button2); // Row 4
		leftVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 5
		
		JButton button3 = new JButton(buttonIcon);
		button3.setContentAreaFilled(false);
		button3.setBorderPainted(false);
		button3.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		leftVerticalButtonPanel.add(button3); // Row 6
		leftVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 7

		return leftVerticalButtonPanel;
	}

	/**
	 * Creates and returns the right vertical buttons panel for the game board.
	 *
	 * @return A JPanel containing buttons for the right side of the game board.
	 */
	private static JPanel createRightVerticalButtonsPanel() {
		// Right Side Buttons Panel
		JPanel rightVerticalButtonPanel = new JPanel(new GridLayout(7, 1, 10, 10));
		rightVerticalButtonPanel.setOpaque(false);

		// Load the image icon for buttons and resize it
		ImageIcon buttonIcon = resizeIcon(new ImageIcon("Assets/switch-button(right to left).png"), 35, 35); // Adjust size as needed

		// Add empty spaces for the 1st, 3rd, 5th, and 7th rows
		rightVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 1
		JButton button1 = new JButton(buttonIcon);
		button1.setContentAreaFilled(false);
		button1.setBorderPainted(false);
		
		button1.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		rightVerticalButtonPanel.add(button1); // Row 2
		rightVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 3
		JButton button2 = new JButton(buttonIcon);
		button2.setContentAreaFilled(false);
		button2.setBorderPainted(false);
		
		button2.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		rightVerticalButtonPanel.add(button2); // Row 4
		rightVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 5
		JButton button3 = new JButton(buttonIcon);
		button3.setContentAreaFilled(false);
		button3.setBorderPainted(false);
		
		button3.setHorizontalTextPosition(SwingConstants.RIGHT); // Set text position
		rightVerticalButtonPanel.add(button3); // Row 6

		rightVerticalButtonPanel.add(Box.createVerticalStrut(0)); // Row 7

		return rightVerticalButtonPanel;
	}

	/**
	 * Creates and returns the control panel for game actions.
	 *
	 * @return A JPanel containing control buttons and options.
	 */
	private static JPanel createControlPanel() {
		// Control Panel
		JPanel controlPanel = new JPanel(new GridBagLayout()); // Use GridBagLayout
		controlPanel.setOpaque(false);

		GridBagConstraints gbc = new GridBagConstraints();
		gbc.fill = GridBagConstraints.BOTH; // Allow components to fill their area

		// Create label1 with image
		JLabel label1 = new JLabel();
		label1.setHorizontalAlignment(SwingConstants.CENTER); // Center image
		label1.setPreferredSize(new Dimension(100, 100)); // Set preferred size (width: 100, height: 100)

		// Load and scale the image for label1
		ImageIcon icon1 = new ImageIcon("Assets/straight-vertical.png");
		Image scaledImage1 = icon1.getImage().getScaledInstance(100, 100, Image.SCALE_SMOOTH);
		label1.setIcon(new ImageIcon(scaledImage1)); // Set scaled image to label1

		// Create label2 with image
		JLabel label2 = new JLabel();
		label2.setHorizontalAlignment(SwingConstants.CENTER); // Center image
		label2.setPreferredSize(new Dimension(100, 100)); // Set preferred size (width: 100, height: 100)

		// Load and scale the image for label2
		ImageIcon icon2 = new ImageIcon("Assets/1-points.png");
		Image scaledImage2 = icon2.getImage().getScaledInstance(100, 100, Image.SCALE_SMOOTH);
		label2.setIcon(new ImageIcon(scaledImage2)); // Set scaled image to label2

		// Create rotate button
		JButton rotateButton = new JButton();
		rotateButton.setContentAreaFilled(false);
		rotateButton.setBorderPainted(false);
		ImageIcon rotateIcon = new ImageIcon("Assets/rotate.png");
		Image scaledRotateImage = rotateIcon.getImage().getScaledInstance(70, 50, Image.SCALE_SMOOTH);
		rotateButton.setIcon(new ImageIcon(scaledRotateImage));

		rotateButton.setPreferredSize(new Dimension(70, 50)); // Set preferred size for button
		rotateButton.setHorizontalAlignment(SwingConstants.CENTER);

		// Create next target label
		JLabel nextTargetLabel = new JLabel("Next Target");
		nextTargetLabel.setHorizontalAlignment(SwingConstants.CENTER); // Center text
		nextTargetLabel.setPreferredSize(new Dimension(100, 30)); // Set preferred size (width: 100, height: 50)

		// Set constraints for label1
		gbc.gridx = 0; // Column 0
		gbc.gridy = 0; // Row 0
		controlPanel.add(label1, gbc);

		// Set constraints for label2
		gbc.gridx = 1; // Column 1
		gbc.gridy = 0; // Row 0
		controlPanel.add(label2, gbc);

		// Set constraints for rotate button
		gbc.gridx = 0; // Column 0
		gbc.gridy = 1; // Row 1
		controlPanel.add(rotateButton, gbc);

		// Set constraints for next target label
		gbc.gridx = 1; // Column 1
		gbc.gridy = 1; // Row 1
		controlPanel.add(nextTargetLabel, gbc);

		return controlPanel;
	}
	
	/**
	 * Creates and returns the chat panel for in-game messages.
	 *
	 * @return A JPanel containing a text area for game messages.
	 */
	public static JPanel createChatPanel() {
        JPanel chatPanel = new JPanel();
        chatPanel.setLayout(new BorderLayout());

        // Set the panel's background with 60% transparency
        chatPanel.setBackground(new Color(202, 170, 227, 170));  // White with 60% transparency
        chatPanel.setOpaque(true);  // Ensure opacity is set correctly for custom transparency

        // Text area to display chat messages (non-editable)
        JTextArea chatArea = new JTextArea();
        chatArea.setEditable(false);  // Users shouldn't edit chat history
        chatArea.setLineWrap(true);   // Wrap text to the next line
        chatArea.setWrapStyleWord(true);
        chatArea.setOpaque(false);  // Make text area transparent
        chatArea.setForeground(Color.BLACK);  // Set text color to black

        // Scroll pane for the chat area
        JScrollPane scrollPane = new JScrollPane(chatArea);
        scrollPane.setOpaque(false);  // Make scroll pane transparent
        scrollPane.getViewport().setOpaque(false);  // Make viewport transparent

        // Text field for typing messages
        JTextField messageField = new JTextField();
        messageField.setOpaque(false);  // Make text field transparent
        messageField.setForeground(Color.BLACK);  // Set text color to black
        messageField.setBackground(new Color(202, 170, 227, 170));  // 60% transparent background

        // Button to send the message
        JButton sendButton = new JButton("Send");

        // Panel to hold the message input and send button
        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new BorderLayout());
        inputPanel.add(messageField, BorderLayout.CENTER);
        inputPanel.add(sendButton, BorderLayout.EAST);
        inputPanel.setOpaque(true);  // Ensure opacity for custom transparency
        inputPanel.setBackground(new Color(202, 170, 227, 160));  // 60% transparent background

        // Add the scrollPane and inputPanel to the chatPanel
        chatPanel.add(scrollPane, BorderLayout.CENTER);
        chatPanel.add(inputPanel, BorderLayout.SOUTH);

        return chatPanel;
    }

	/**
	 * Resets the GridBagConstraints to default values.
	 *
	 * @param gbc The GridBagConstraints object to reset.
	 */
	public static void resetGBC(GridBagConstraints gbc) {
		gbc.gridx = GridBagConstraints.RELATIVE;      // Default for gridx
		gbc.gridy = GridBagConstraints.RELATIVE;      // Default for gridy
		gbc.gridwidth = 1;                            // Default for gridwidth
		gbc.gridheight = 1;                           // Default for gridheight
		gbc.weightx = 0.0;                            // Default for weightx
		gbc.weighty = 0.0;                            // Default for weighty
		gbc.anchor = GridBagConstraints.CENTER;       // Default for anchor
		gbc.fill = GridBagConstraints.NONE;           // Default for fill
		gbc.insets = new Insets(20, 20, 20, 20); 	  // Add padding between components
		gbc.ipadx = 0;                                // Default for ipadx
		gbc.ipady = 0;                                // Default for ipady
	}

}
