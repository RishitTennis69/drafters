// Fantasy Football Draft Board Application
class DraftBoard {
    constructor() {
        this.players = [];
        this.currentPick = 1;
        this.totalPicks = 180;
        this.teams = 12;
        this.rounds = 15;
        
        this.init();
    }

    init() {
        this.generateDraftBoard();
        this.bindEvents();
        this.updateSummary();
        this.loadFromStorage();
    }

    // Generate the draft board structure
    generateDraftBoard() {
        const tbody = document.getElementById('draftBoardBody');
        tbody.innerHTML = '';

        for (let round = 1; round <= this.rounds; round++) {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50 transition-colors duration-150';
            
            // Round number
            const roundCell = document.createElement('td');
            roundCell.className = 'px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50';
            roundCell.textContent = `Round ${round}`;
            row.appendChild(roundCell);

            // Team cells for this round
            for (let team = 1; team <= this.teams; team++) {
                const teamCell = document.createElement('td');
                teamCell.className = 'px-4 py-3 text-center border-l border-gray-200 min-h-[80px]';
                
                // Calculate pick number for this cell
                const pickNumber = this.getPickNumber(round, team);
                teamCell.dataset.pickNumber = pickNumber;
                teamCell.dataset.round = round;
                teamCell.dataset.team = team;
                
                // Add placeholder text
                teamCell.innerHTML = `<div class="text-xs text-gray-400">Pick ${pickNumber}</div>`;
                
                // Add click handler for manual editing
                teamCell.addEventListener('click', () => this.handleCellClick(teamCell));
                
                row.appendChild(teamCell);
            }
            
            tbody.appendChild(row);
        }
    }

    // Calculate pick number based on snake draft logic
    getPickNumber(round, team) {
        if (round % 2 === 1) {
            // Odd rounds: 1 → 12
            return (round - 1) * this.teams + team;
        } else {
            // Even rounds: 12 → 1
            return (round - 1) * this.teams + (this.teams - team + 1);
        }
    }

    // Get round and team from pick number
    getRoundAndTeam(pickNumber) {
        const round = Math.ceil(pickNumber / this.teams);
        let team;
        
        if (round % 2 === 1) {
            // Odd rounds: 1 → 12
            team = pickNumber - (round - 1) * this.teams;
        } else {
            // Even rounds: 12 → 1
            team = this.teams - (pickNumber - (round - 1) * this.teams) + 1;
        }
        
        return { round, team };
    }

    // Handle cell click for manual editing
    handleCellClick(cell) {
        const pickNumber = parseInt(cell.dataset.pickNumber);
        const round = parseInt(cell.dataset.round);
        const team = parseInt(cell.dataset.team);
        
        // Check if this pick is already taken
        const existingPlayer = this.players.find(p => p.draftPick === pickNumber);
        
        if (existingPlayer) {
            // Show player info and allow editing
            this.showPlayerInfo(cell, existingPlayer);
        } else {
            // Allow adding a new player
            this.promptForPlayer(pickNumber, round, team);
        }
    }

    // Show player information in cell
    showPlayerInfo(cell, player) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cursor-pointer group';
        infoDiv.innerHTML = `
            <div class="font-medium text-sm">${player.name}</div>
            <div class="text-xs text-gray-600">${player.position} - ${player.nflTeam}</div>
            <div class="text-xs text-gray-500">Pick ${player.draftPick}</div>
            <button class="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    onclick="draftBoard.removePlayer(${player.draftPick})">Remove</button>
        `;
        
        cell.innerHTML = '';
        cell.appendChild(infoDiv);
    }

    // Prompt user to add a player
    promptForPlayer(pickNumber, round, team) {
        // Auto-fill the form
        document.getElementById('draftPick').value = pickNumber;
        
        // Focus on player name
        document.getElementById('playerName').focus();
        
        // Highlight the target cell
        this.highlightCell(pickNumber);
    }

    // Highlight a specific cell
    highlightCell(pickNumber) {
        // Remove previous highlights
        document.querySelectorAll('.highlight-cell').forEach(cell => {
            cell.classList.remove('highlight-cell', 'bg-yellow-100', 'border-2', 'border-yellow-400');
        });
        
        // Find and highlight the target cell
        const targetCell = document.querySelector(`[data-pick-number="${pickNumber}"]`);
        if (targetCell) {
            targetCell.classList.add('highlight-cell', 'bg-yellow-100', 'border-2', 'border-yellow-400');
            
            // Scroll to the cell
            targetCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Add a player to the draft board
    addPlayer(playerData) {
        // Validate required fields
        if (!playerData.name || !playerData.position || !playerData.nflTeam || !playerData.draftPick) {
            alert('Please fill in all required fields');
            return false;
        }

        const draftPick = parseInt(playerData.draftPick);
        
        // Check if pick number is valid
        if (draftPick < 1 || draftPick > this.totalPicks) {
            alert(`Pick number must be between 1 and ${this.totalPicks}`);
            return false;
        }

        // Check if pick is already taken
        if (this.players.find(p => p.draftPick === draftPick)) {
            alert(`Pick ${draftPick} is already taken`);
            return false;
        }

        // Check for duplicate player names
        if (this.players.find(p => p.name.toLowerCase() === playerData.name.toLowerCase())) {
            alert('This player has already been drafted');
            return false;
        }

        // Add player to the list
        const player = {
            ...playerData,
            draftPick: draftPick,
            timestamp: new Date().toISOString()
        };
        
        this.players.push(player);
        
        // Update the draft board
        this.updateDraftBoard();
        
        // Update summary
        this.updateSummary();
        
        // Save to storage
        this.saveToStorage();
        
        // Clear form
        this.clearForm();
        
        // Remove highlight
        this.removeHighlight();
        
        return true;
    }

    // Remove a player from the draft board
    removePlayer(draftPick) {
        if (confirm('Are you sure you want to remove this player?')) {
            this.players = this.players.filter(p => p.draftPick !== draftPick);
            this.updateDraftBoard();
            this.updateSummary();
            this.saveToStorage();
        }
    }

    // Update the draft board display
    updateDraftBoard() {
        // Clear all cells
        document.querySelectorAll('[data-pick-number]').forEach(cell => {
            cell.innerHTML = `<div class="text-xs text-gray-400">Pick ${cell.dataset.pickNumber}</div>`;
        });

        // Fill in drafted players
        this.players.forEach(player => {
            const cell = document.querySelector(`[data-pick-number="${player.draftPick}"]`);
            if (cell) {
                this.showPlayerInfo(cell, player);
            }
        });
    }

    // Update the summary section
    updateSummary() {
        document.getElementById('totalPicks').textContent = this.players.length;
        
        if (this.players.length === 0) {
            document.getElementById('currentRound').textContent = '1';
            document.getElementById('nextPick').textContent = '1';
        } else {
            const nextPick = this.players.length + 1;
            const { round } = this.getRoundAndTeam(nextPick);
            document.getElementById('currentRound').textContent = round;
            document.getElementById('nextPick').textContent = nextPick;
        }
    }

    // Search for players
    searchPlayers(query) {
        if (!query.trim()) {
            document.getElementById('searchResults').textContent = '';
            return;
        }

        const results = this.players.filter(player => 
            player.name.toLowerCase().includes(query.toLowerCase()) ||
            player.position.toLowerCase().includes(query.toLowerCase()) ||
            player.nflTeam.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            document.getElementById('searchResults').textContent = 'No players found';
        } else {
            const resultText = results.map(player => 
                `${player.name} (${player.position} - ${player.nflTeam}) - Pick ${player.draftPick}`
            ).join(', ');
            document.getElementById('searchResults').textContent = `Found: ${resultText}`;
        }
    }

    // Clear the form
    clearForm() {
        document.getElementById('playerName').value = '';
        document.getElementById('playerPosition').value = '';
        document.getElementById('playerNFLTeam').value = '';
        document.getElementById('draftPick').value = '';
    }

    // Remove cell highlight
    removeHighlight() {
        document.querySelectorAll('.highlight-cell').forEach(cell => {
            cell.classList.remove('highlight-cell', 'bg-yellow-100', 'border-2', 'border-yellow-400');
        });
    }

    // Save data to localStorage
    saveToStorage() {
        localStorage.setItem('fantasyDraftBoard', JSON.stringify({
            players: this.players,
            timestamp: new Date().toISOString()
        }));
    }

    // Load data from localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('fantasyDraftBoard');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.players && Array.isArray(data.players)) {
                    this.players = data.players;
                    this.updateDraftBoard();
                    this.updateSummary();
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    // Bind event listeners
    bindEvents() {
        // Add player button
        document.getElementById('addPlayerBtn').addEventListener('click', () => {
            const playerData = {
                name: document.getElementById('playerName').value.trim(),
                position: document.getElementById('playerPosition').value,
                nflTeam: document.getElementById('playerNFLTeam').value.trim(),
                draftPick: document.getElementById('draftPick').value
            };
            
            this.addPlayer(playerData);
        });

        // Search functionality
        document.getElementById('searchPlayer').addEventListener('input', (e) => {
            this.searchPlayers(e.target.value);
        });

        // Enter key support for form
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addPlayerBtn').click();
            }
        });

        document.getElementById('playerPosition').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addPlayerBtn').click();
            }
        });

        document.getElementById('playerNFLTeam').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addPlayerBtn').click();
            }
        });

        document.getElementById('draftPick').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addPlayerBtn').click();
            }
        });

        // Auto-fill draft pick when clicking on cells
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-pick-number]')) {
                const cell = e.target.closest('[data-pick-number]');
                const pickNumber = cell.dataset.pickNumber;
                document.getElementById('draftPick').value = pickNumber;
            }
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.draftBoard = new DraftBoard();
});

// Add some sample data for demonstration (remove in production)
function addSampleData() {
    const samplePlayers = [
        { name: 'Christian McCaffrey', position: 'RB', nflTeam: 'SF', draftPick: 1 },
        { name: 'Tyreek Hill', position: 'WR', nflTeam: 'MIA', draftPick: 2 },
        { name: 'Austin Ekeler', position: 'RB', nflTeam: 'WAS', draftPick: 3 },
        { name: 'Stefon Diggs', position: 'WR', nflTeam: 'HOU', draftPick: 4 },
        { name: 'Saquon Barkley', position: 'RB', nflTeam: 'PHI', draftPick: 5 }
    ];
    
    samplePlayers.forEach(player => {
        window.draftBoard.addPlayer(player);
    });
}

// Export for potential use in console
window.addSampleData = addSampleData;
