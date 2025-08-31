# Fantasy Football Draft Board

A modern, interactive web application for managing fantasy football drafts with a snake draft format.

## Features

### 🏈 Draft Board Layout
- **12 Teams × 15 Rounds** = 180 total draft picks
- **Snake Draft Format**: 
  - Round 1: Picks 1 → 12
  - Round 2: Picks 12 → 1
  - Round 3: Picks 1 → 12
  - And so on...
- **Visual Grid**: Each cell represents a draft pick with clear team and round identification

### 🎯 Player Management
- **Add Players**: Enter player name, position, NFL team, and draft pick number
- **Duplicate Prevention**: Automatically prevents duplicate player entries
- **Validation**: Ensures pick numbers are valid (1-180) and not already taken
- **Remove Players**: Click on any drafted player to remove them

### 🔍 Search & Navigation
- **Real-time Search**: Find players by name, position, or NFL team
- **Cell Highlighting**: Click any cell to highlight it and auto-fill the draft pick
- **Smooth Scrolling**: Automatically scrolls to highlighted cells

### 💾 Data Persistence
- **Local Storage**: All draft data is automatically saved to your browser
- **Session Recovery**: Data persists between browser sessions
- **Export Ready**: Easy to copy data for external use

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TailwindCSS**: Clean, modern styling with smooth animations
- **Team Colors**: Each team has a distinct color scheme
- **Interactive Elements**: Hover effects and smooth transitions

## How to Use

### 1. Getting Started
1. Open `index.html` in your web browser
2. The draft board will automatically generate with 15 rounds and 12 teams
3. Each cell shows the corresponding draft pick number

### 2. Adding Players
1. **Fill out the form** at the top:
   - Player Name (required)
   - Position (QB, RB, WR, TE, K, DEF)
   - NFL Team (required)
   - Draft Pick # (1-180, required)
2. Click **"Add Player"** or press Enter
3. The player will appear on the draft board in the correct cell

### 3. Quick Entry Method
1. **Click any empty cell** on the draft board
2. The draft pick number will automatically fill in the form
3. The cell will be highlighted in yellow
4. Enter the player details and click "Add Player"

### 4. Searching Players
1. Use the **search bar** to find drafted players
2. Search by player name, position, or NFL team
3. Results appear in real-time below the search bar

### 5. Managing Players
- **View Player Info**: Click on any drafted player to see details
- **Remove Players**: Hover over a player cell and click the "Remove" button
- **Edit Players**: Remove and re-add to make changes

## Technical Details

### File Structure
```
fantasydraftboard/
├── index.html          # Main HTML file with UI structure
├── script.js           # JavaScript application logic
└── README.md           # This documentation file
```

### Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

### Data Storage
- Uses `localStorage` for data persistence
- No external dependencies or database required
- Data is stored locally in your browser

## Snake Draft Logic

The application automatically calculates the correct draft order:

- **Round 1**: Team 1 → Team 2 → Team 3 → ... → Team 12
- **Round 2**: Team 12 → Team 11 → Team 10 → ... → Team 1
- **Round 3**: Team 1 → Team 2 → Team 3 → ... → Team 12
- **And so on...**

This ensures fair draft positioning across all rounds.

## Sample Data

To see the application in action with sample data:
1. Open the browser console (F12)
2. Type: `addSampleData()`
3. Press Enter

This will add 5 sample players to demonstrate the functionality.

## Customization

### Team Names
Edit the team headers in `index.html` to use your actual team names:
```html
<th class="...">Your Team Name</th>
```

### Colors
Modify the team colors in the TailwindCSS configuration within `index.html`:
```javascript
'team-1': '#your-color-here'
```

### Draft Size
Adjust the number of teams, rounds, or total picks in `script.js`:
```javascript
this.teams = 12;      // Number of teams
this.rounds = 15;     // Number of rounds
this.totalPicks = 180; // Total draft picks
```

## Troubleshooting

### Common Issues
1. **Player not appearing**: Check that all required fields are filled
2. **Duplicate player error**: The player name already exists in the draft
3. **Invalid pick number**: Must be between 1 and 180
4. **Pick already taken**: Another player is already assigned to that pick

### Data Recovery
If you need to reset the draft board:
1. Open browser console (F12)
2. Type: `localStorage.removeItem('fantasyDraftBoard')`
3. Refresh the page

## Future Enhancements

Potential features for future versions:
- Team roster management
- Draft timer functionality
- Player rankings and ADP data
- Export to CSV/PDF
- Multi-league support
- Real-time collaboration
- Mobile app version

## Support

This is a standalone web application that runs entirely in your browser. No server setup or external services are required.

For questions or suggestions, please refer to the code comments or modify the application as needed for your specific use case.
