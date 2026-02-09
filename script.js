// Global variables
let currentPage = 'landing-page';
let soundEnabled = true;
let musicEnabled = false;
let clickCount = 0;
let loveCounter = 0;
let currentQuestion = 0;
let selectedOption = null;
let quizScore = 0;
let envelopeOpened = localStorage.getItem('envelopeOpened') === 'true';

// Page order for navigation (updated with secret place)
const pageOrder = [
    'landing-page',
    'gifts-page',
    'gift1-page',
    'gift2-page',
    'gift3-page',
    'games-hub-page',
    'game1-heart-catcher-page',
    'game2-memory-match-page',
    'game3-love-quest-page',
    'game4-rhythm-tap-page',
    'finally-page',
    'secret-place-page'
];

// Quiz data
const quizQuestions = [
    {
        question: 'Who is the absolute "Boss" in this relationship 😏?',
        options: ['Obviously You', 'Me', 'My Mom']
    },
    {
        question: 'What do I love the most about you 😭?',
        options: ['Your smile', 'Your soul', 'Everything about you']
    },
    {
        question: 'If I had only one wish, what would it be 🧿?',
        options: ['To hug you forever', 'To stay with you always', 'To make you the happiest']
    },
    {
        question: 'When you are sad, what do I want to do first 🥺?',
        options: ['Hold you close', 'Listen to every word', 'Kiss your forehead']
    },
    {
        question: 'Our love vibe is more like 😚?',
        options: ['Soft and safe', 'Crazy and cute', 'Forever and real']
    }
];

// Polaroid data (now with image placeholders)
const polaroids = [
    { caption: 'Our First Date', emoji: '👫', taped: true, image: 'placeholder1.jpg' },
    { caption: 'Your Beautiful Smile', emoji: '😊', taped: false, image: 'placeholder2.jpg' },
    { caption: 'Perfect Day Together', emoji: '☀️', taped: false, image: 'placeholder3.jpg' },
    { caption: 'Only Us Forever', emoji: '💑', taped: true, image: 'placeholder4.jpg' },
    { caption: 'My Home Is You', emoji: '🏡', taped: false, image: 'placeholder5.jpg' },
    { caption: 'Forever Us', emoji: '💖', taped: false, image: 'placeholder6.jpg' }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show envelope overlay if not already opened
    if (!envelopeOpened) {
        showEnvelopeOverlay();
    } else {
        document.querySelector('.envelope-overlay').style.display = 'none';
        document.querySelector('.main-container').style.opacity = '1';
    }
    
    // Create floating petals in background
    createPetals();
    
    // Create heart particles for gift cards
    createHeartParticles();
    
    // Create polaroid grid
    createPolaroidGrid();
    
    // Create secret place hearts
    createSecretHearts();
    
    // Initialize quiz
    loadQuestion(0);
    
    // Update navigation buttons
    updateNavButtons();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add sparkles occasionally
    setInterval(createSparkle, 2000);
    
    // Initialize games
    initGames();
    
    // Load saved high scores
    loadHighScores();
});

// ===== ENVELOPE OVERLAY FUNCTIONS =====
function showEnvelopeOverlay() {
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const envelopePaper = document.getElementById('envelope-paper');
    const overlay = document.getElementById('envelope-overlay');
    
    // Reset envelope state
    envelopeFlap.style.transform = 'rotateX(0deg)';
    envelopePaper.classList.remove('opened');
    
    // Add click event
    envelope.addEventListener('click', openEnvelope);
    
    // Show instruction animation
    setTimeout(() => {
        document.querySelector('.envelope-instruction').style.opacity = '1';
    }, 500);
}

function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const envelopePaper = document.getElementById('envelope-paper');
    const overlay = document.getElementById('envelope-overlay');
    
    // Remove click event to prevent multiple openings
    envelope.removeEventListener('click', openEnvelope);
    
    // Play opening sound
    playEnvelopeSound();
    
    // Open envelope flap
    envelopeFlap.style.transform = 'rotateX(-180deg)';
    
    // Unfold paper after delay
    setTimeout(() => {
        envelopePaper.classList.add('opened');
        
        // Create heart confetti
        createHeartConfetti();
        
        // Show main content after delay
        setTimeout(() => {
            overlay.style.opacity = '0';
            
            // Store in localStorage that envelope has been opened
            localStorage.setItem('envelopeOpened', 'true');
            
            // Remove overlay after fade out
            setTimeout(() => {
                overlay.style.display = 'none';
                document.querySelector('.main-container').style.opacity = '1';
                document.querySelector('.main-container').style.transition = 'opacity 1s ease';
            }, 1000);
        }, 3000);
    }, 800);
}

function playEnvelopeSound() {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create whoosh sound for envelope opening
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.8);
        
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
        console.log("Audio not supported");
    }
}

function createHeartConfetti() {
    const container = document.getElementById('heart-confetti');
    const heartCount = 50;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-confetti-particle';
        heart.innerHTML = '❤';
        
        // Random properties
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 2 + 2;
        const size = Math.random() * 20 + 15;
        
        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.fontSize = `${size}px`;
        heart.style.color = i % 3 === 0 ? '#ff6b9d' : (i % 3 === 1 ? '#ff4757' : '#ff3838');
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, (duration + delay) * 1000);
    }
}
// ===== ENVELOPE END =====

//===== SECRET PLACE FUNCTIONS =====
function createSecretHearts() {
    const container = document.querySelector('.secret-background-hearts');
    const heartCount = 15;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'secret-heart-particle';
        heart.innerHTML = '❤';
        
        // Random properties
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 4 + 8;
        const size = Math.random() * 15 + 15;
        
        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.fontSize = `${size}px`;
        
        container.appendChild(heart);
    }
}
// ===== SECRET PLACE END =====

// Create floating petals
function createPetals() {
    const container = document.getElementById('background-petals');
    const petalCount = 25;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Random properties
        const size = Math.random() * 12 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 15 + 20;
        
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}%`;
        petal.style.animationDelay = `${delay}s`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.backgroundColor = `rgba(255, ${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 100 + 180)}, 0.5)`;
        
        container.appendChild(petal);
    }
}

// Create heart particles for gift cards
function createHeartParticles() {
    const giftCards = document.querySelectorAll('.gift-card');
    
    giftCards.forEach(card => {
        const heartsContainer = card.querySelector('.hearts-particles');
        const heartCount = 10;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '❤';
            
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = Math.random() * 2 + 2;
            
            heart.style.left = `${left}%`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.animationDuration = `${duration}s`;
            
            heartsContainer.appendChild(heart);
        }
    });
}

// Create polaroid grid (updated with image placeholders)
function createPolaroidGrid() {
    const grid = document.querySelector('.polaroid-grid');
    
    polaroids.forEach((polaroid, index) => {
        const polaroidElement = document.createElement('div');
        polaroidElement.className = 'polaroid';
        if (polaroid.taped) polaroidElement.classList.add('taped');
        polaroidElement.dataset.index = index;
        
        polaroidElement.innerHTML = `
            <div class="polaroid-img">
                <div class="image-placeholder">${polaroid.emoji}</div>
                <!-- Replace the above div with an img tag when you have actual images -->
                <!-- <img src="${polaroid.image}" alt="${polaroid.caption}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;"> -->
            </div>
            <div class="polaroid-caption">${polaroid.caption}</div>
        `;
        
        grid.appendChild(polaroidElement);
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('see-gifts-btn').addEventListener('click', () => navigateTo('gifts-page'));
    document.getElementById('finally-btn').addEventListener('click', () => navigateTo('finally-page'));
    document.getElementById('back-from-gift1').addEventListener('click', () => navigateTo('gifts-page'));
    document.getElementById('back-from-gift2').addEventListener('click', () => navigateTo('gifts-page'));
    document.getElementById('back-from-gift3').addEventListener('click', () => navigateTo('gifts-page'));
    document.getElementById('back-from-games-hub').addEventListener('click', () => navigateTo('gifts-page'));
    document.getElementById('back-from-finally').addEventListener('click', () => navigateTo('gifts-page'));
    document.getElementById('back-from-secret').addEventListener('click', () => navigateTo('finally-page'));
    document.getElementById('go-to-secret').addEventListener('click', () => navigateTo('secret-place-page'));
    
    // Secret garden button
    document.getElementById('visit-secret-garden').addEventListener('click', () => {
        window.open('https://atexidk-cmd.github.io/heart/', '_blank');
        playSound('pop');
    });
    
    // Next/Prev navigation
    document.getElementById('next-btn').addEventListener('click', goToNextPage);
    document.getElementById('prev-btn').addEventListener('click', goToPrevPage);
    
    // Gift cards
    document.querySelectorAll('.gift-card').forEach(card => {
        card.addEventListener('click', function() {
            const giftNum = this.dataset.gift;
            if (giftNum === '4') {
                navigateTo('games-hub-page');
            } else {
                navigateTo(`gift${giftNum}-page`);
            }
            
            // Highlight the clicked card
            document.querySelectorAll('.gift-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Game cards
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const gameNum = this.dataset.game;
            navigateTo(`game${gameNum}-${getGamePageName(gameNum)}-page`);
            playSound('pop');
        });
    });
    
    // Polaroid click
    document.querySelector('.polaroid-grid').addEventListener('click', function(e) {
        const polaroid = e.target.closest('.polaroid');
        if (polaroid) {
            const index = polaroid.dataset.index;
            openPolaroidModal(index);
        }
    });
    
    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        this.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        playSound('pop');
    });
    
    // Music toggle (optional)
    document.getElementById('music-toggle').addEventListener('click', function() {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            this.classList.add('playing');
            this.innerHTML = '<i class="fas fa-pause"></i>';
            // Optional: Add background music here
        } else {
            this.classList.remove('playing');
            this.innerHTML = '<i class="fas fa-music"></i>';
            // Optional: Stop background music here
        }
    });
    
    // Love counter
    document.getElementById('love-counter').addEventListener('click', function() {
        loveCounter++;
        if (loveCounter === 1) {
            document.getElementById('counter-value').textContent = 'Everyday';
            this.style.color = '#ff6b9d';
            this.style.fontWeight = '600';
            playSound('pop');
            createSparkleBurst();
        }
    });
    
    // Easter egg on gifts title
    document.getElementById('gifts-title').addEventListener('click', function() {
        clickCount++;
        if (clickCount === 3) {
            showEasterEgg();
            clickCount = 0;
        }
    });
    
    // Modal close
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('image-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Play button on video
    document.querySelector('.play-button').addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-pause"></i>';
        playSound('pop');
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-play"></i>';
        }, 3000);
    });
    
    // Quiz option selection
    document.getElementById('options-container').addEventListener('click', function(e) {
        const option = e.target.closest('.option');
        if (option && !option.classList.contains('selected')) {
            // Remove selection from other options
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select this option
            option.classList.add('selected');
            selectedOption = option.dataset.index;
            
            // Show next button
            document.getElementById('next-question-btn').style.display = 'block';
            
            playSound('pop');
        }
    });
    
    // Next question button
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    
    // Download button
    document.getElementById('download-btn').addEventListener('click', function() {
        downloadMemory();
        playSound('pop');
    });
    
    // Print buttons
    document.getElementById('print-polaroids').addEventListener('click', printPolaroids);
    document.getElementById('print-letter').addEventListener('click', printLetter);
    
    // Game back buttons
    document.getElementById('back-from-game1').addEventListener('click', () => navigateTo('games-hub-page'));
    document.getElementById('back-from-game2').addEventListener('click', () => navigateTo('games-hub-page'));
    document.getElementById('back-from-game3').addEventListener('click', () => navigateTo('games-hub-page'));
    document.getElementById('back-from-game4').addEventListener('click', () => navigateTo('games-hub-page'));
}

// Get game page name (updated for 4 games)
function getGamePageName(gameNum) {
    const gameNames = {
        '1': 'heart-catcher',
        '2': 'memory-match',
        '3': 'love-quest',
        '4': 'rhythm-tap'
    };
    return gameNames[gameNum] || '';
}

// Navigation function
function navigateTo(pageId) {
    // Play sound
    playSound('pop');
    
    // Exit current page
    const currentPageElement = document.getElementById(currentPage);
    currentPageElement.classList.remove('active');
    currentPageElement.classList.add('exit');
    
    // Enter new page
    setTimeout(() => {
        currentPageElement.classList.remove('exit');
        const newPage = document.getElementById(pageId);
        newPage.classList.add('active');
        currentPage = pageId;
        
        // If navigating to quiz page, reset if needed
        if (pageId === 'gift2-page' && currentQuestion >= quizQuestions.length) {
            resetQuiz();
        }
        
        // Create sparkles on page change for special pages
        if (pageId === 'finally-page' || pageId === 'gift3-page' || pageId === 'secret-place-page') {
            createSparkleBurst();
        }
        
        // Update navigation buttons
        updateNavButtons();
        
        // Update page indicator
        updatePageIndicator();
        
        // Initialize game if needed
        if (pageId.startsWith('game')) {
            initGame(pageId);
        }
    }, 300);
}

// Go to next page in sequence
function goToNextPage() {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex < pageOrder.length - 1) {
        navigateTo(pageOrder[currentIndex + 1]);
    }
}

// Go to previous page in sequence
function goToPrevPage() {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex > 0) {
        navigateTo(pageOrder[currentIndex - 1]);
    }
}

// Update navigation buttons state
function updateNavButtons() {
    const currentIndex = pageOrder.indexOf(currentPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Update previous button
    if (currentIndex === 0) {
        prevBtn.classList.add('disabled');
        prevBtn.disabled = true;
    } else {
        prevBtn.classList.remove('disabled');
        prevBtn.disabled = false;
    }
    
    // Update next button
    if (currentIndex === pageOrder.length - 1) {
        nextBtn.classList.add('disabled');
        nextBtn.disabled = true;
        nextBtn.innerHTML = 'The End <i class="fas fa-heart"></i>';
    } else if (currentIndex === pageOrder.length - 2) {
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
        nextBtn.innerHTML = 'Last Page <i class="fas fa-arrow-right"></i>';
    } else {
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

//Update page indicator dots
function updatePageIndicator() {
    const pageToDotMap = {
        'landing-page': 0,
        'gifts-page': 1,
        'gift1-page': 2,
        'gift2-page': 3,
        'gift3-page': 4,
        'games-hub-page': 5,
        'game1-heart-catcher-page': 5,
        'game2-memory-match-page': 5,
        'game3-love-quest-page': 5,
        'game4-rhythm-tap-page': 5,
        'finally-page': 6,
        'secret-place-page': 7
    };
    
    const currentIndex = pageToDotMap[currentPage] || 0;
    const dots = document.querySelectorAll('.page-dot');
    
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Play sound effect
function playSound(type) {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = type === 'pop' ? 523.25 : 659.25; // C5 or E5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log("Audio not supported");
    }
}

// Show easter egg
function showEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    easterEgg.classList.add('show');
    playSound('pop');
    
    // Create sparkles
    createSparkleBurst();
    
    setTimeout(() => {
        easterEgg.classList.remove('show');
    }, 3000);
}

// Open polaroid modal
function openPolaroidModal(index) {
    const polaroid = polaroids[index];
    document.getElementById('modal-title').textContent = polaroid.caption;
    document.getElementById('modal-image').innerHTML = polaroid.emoji;
    document.getElementById('modal-description').textContent = `This captures a moment of "${polaroid.caption.toLowerCase()}" from our journey together.`;
    
    document.getElementById('image-modal').classList.add('active');
    playSound('pop');
}

// Close modal
function closeModal() {
    document.getElementById('image-modal').classList.remove('active');
    playSound('pop');
}

// Load quiz question
function loadQuestion(index) {
    if (index >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    currentQuestion = index;
    const question = quizQuestions[index];
    
    document.getElementById('current-question').textContent = index + 1;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('progress-fill').style.width = `${(index + 1) * 20}%`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = i;
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('next-question-btn').style.display = 'none';
    
    // Update next button text for last question
    if (index === quizQuestions.length - 1) {
        document.getElementById('next-question-btn').innerHTML = 'FINISH <i class="fas fa-arrow-right"></i>';
    } else {
        document.getElementById('next-question-btn').innerHTML = 'NEXT <i class="fas fa-arrow-right"></i>';
    }
    
    selectedOption = null;
}

// Next question in quiz
function nextQuestion() {
    if (selectedOption === null) return;
    
    // For this demo, all answers are correct (cute joke)
    quizScore++;
    
    // Mark selected option as correct
    document.querySelectorAll('.option').forEach(opt => {
        if (opt.dataset.index == selectedOption) {
            opt.classList.add('correct');
        }
    });
    
    // Wait a moment then go to next question
    setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
            loadQuestion(currentQuestion + 1);
        } else {
            showQuizResults();
        }
    }, 800);
    
    playSound('pop');
}
// Show quiz results
function showQuizResults() {
    const quizCard = document.querySelector('.quiz-card');
    quizCard.innerHTML = `
        <h2 style="color: #ff6b9d; margin-bottom: 25px;">You did amazing baby 😭❤️</h2>
        <div style="font-size: 1.8rem; font-weight: 700; color: #2a1a1f; margin-bottom: 25px;">
            Score: ${quizScore} of ${quizQuestions.length}
        </div>
        <p style="color: #5a4a4f; line-height: 1.6; margin-bottom: 35px; font-size: 1.2rem;">
            No matter what you pick, you are still the boss and you are still my favorite person!
        </p>
        <div style="display: flex; gap: 20px; justify-content: center;">
            <button class="btn btn-small" id="replay-quiz">REPLAY</button>
            <button class="btn btn-small" id="back-from-results"><i class="fas fa-arrow-left"></i> BACK</button>
        </div>
    `;
    
    // Add event listeners to new buttons
    setTimeout(() => {
        document.getElementById('replay-quiz').addEventListener('click', resetQuiz);
        document.getElementById('back-from-results').addEventListener('click', () => navigateTo('gifts-page'));
    }, 100);
    
    // Create sparkles
    createSparkleBurst();
    playSound('pop');
}

// Reset quiz
function resetQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    selectedOption = null;
    loadQuestion(0);
    playSound('pop');
}

// Create a single sparkle
function createSparkle() {
    if (Math.random() > 0.7) { // 30% chance
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const container = document.querySelector('.main-container');
        const rect = container.getBoundingClientRect();
        
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        container.appendChild(sparkle);
        
        // Animate sparkle
        sparkle.animate([
            { opacity: 0, transform: 'scale(0) rotate(0deg)' },
            { opacity: 1, transform: 'scale(1) rotate(180deg)', offset: 0.5 },
            { opacity: 0, transform: 'scale(0) rotate(360deg)' }
        ], {
            duration: 1200,
            easing: 'ease-out'
        });
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1200);
    }
}

// Create a burst of sparkles
function createSparkleBurst() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 50);
    }
}

// Download memory function
function downloadMemory() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const message = `💝 My Dearest Love 💝

To the one who makes every day special,

On this Valentine's Day (${dateStr}), I want you to know:
• You are the most amazing person in my life
• Every moment with you is a treasure
• My love for you grows stronger every day
• You are my forever Valentine

Remember our special moments:
✨ Our first date
✨ Our inside jokes
✨ The way you make me smile
✨ Every "I love you" we've shared

I promise to:
❤️ Always be there for you
❤️ Support your dreams
❤️ Make you laugh every day
❤️ Love you more with each passing moment

You are my everything.

Forever yours,
Your Loving Partner

Love Counter: ${document.getElementById('counter-value').textContent}
Created with love ❤️`;

    const blob = new Blob([message], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Our_Special_Memory.txt';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show notification
        showNotification('Memory downloaded! 💖', 2000);
        createSparkleBurst();
    }, 100);
}

// Print polaroids
function printPolaroids() {
    showNotification('Printing our photos... 📸', 1500);
    playSound('pop');
    // In a real implementation, this would open a print dialog
    // window.print();
}

// Print letter
function printLetter() {
    showNotification('Printing Valentine card... 💌', 1500);
    playSound('pop');
    // In a real implementation, this would open a print dialog
    // window.print();
}

// Show notification
function showNotification(message, duration) {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(145deg, #ff6b9d, #ff8fab);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: fadeInOut 2s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            20% { opacity: 1; transform: translateX(-50%) translateY(0); }
            80% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
    }, duration);
}

/* ==============================================
   GAMES FEATURE - All 4 Games Implementation
   ============================================== */

// Load high scores from localStorage
function loadHighScores() {
    // Heart Catcher
    const heartCatcherHigh = localStorage.getItem('heartCatcherHighScore') || 0;
    document.getElementById('heart-catcher-high-score').textContent = heartCatcherHigh;
    
    // Memory Match
    const memoryTime = localStorage.getItem('memoryBestTime') || '--';
    const memoryMoves = localStorage.getItem('memoryBestMoves') || '--';
    // You can display these somewhere if you want
    
    // Rhythm Tap
    const rhythmHigh = localStorage.getItem('rhythmHighScore') || 0;
    // You can display this if you add a high score display
}

// Initialize all games
function initGames() {
    // Initialize memory game
    initMemoryGame();
    
    // Initialize love quest
    initLoveQuest();
    
    // Show music toggle (optional)
    document.getElementById('music-toggle').style.display = 'flex';
}

// Initialize specific game when page loads
function initGame(pageId) {
    switch(pageId) {
        case 'game1-heart-catcher-page':
            initHeartCatcher();
            break;
        case 'game2-memory-match-page':
            initMemoryGame();
            break;
        case 'game3-love-quest-page':
            initLoveQuest();
            break;
        case 'game4-rhythm-tap-page':
            initRhythmTap();
            break;
    }
}

/* ========== GAME 1: HEART CATCHER ========== */
let heartCatcherGame = null;

function initHeartCatcher() {
    const canvas = document.getElementById('heart-catcher-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Load high score
    const highScore = parseInt(localStorage.getItem('heartCatcherHighScore')) || 0;
    
    // Game state
    heartCatcherGame = {
        canvas: canvas,
        ctx: ctx,
        basket: {
            x: canvas.width / 2 - 40,
            y: canvas.height - 60,
            width: 80,
            height: 40,
            speed: 10
        },
        hearts: [],
        goldenHearts: [],
        particles: [],
        score: 0,
        lives: 3,
        highScore: highScore,
        gameRunning: false,
        gameOver: false,
        lastSpawn: 0,
        spawnRate: 1000,
        speed: 2,
        keys: {},
        animationId: null
    };
    
    // Update display
    updateHeartCatcherDisplay();
    
    // Event listeners for game controls
    document.getElementById('heart-catcher-start').addEventListener('click', startHeartCatcher);
    document.getElementById('heart-catcher-pause').addEventListener('click', pauseHeartCatcher);
    document.getElementById('heart-catcher-restart').addEventListener('click', restartHeartCatcher);
    document.getElementById('heart-catcher-replay').addEventListener('click', restartHeartCatcher);
    document.getElementById('heart-catcher-back-from-game').addEventListener('click', () => navigateTo('games-hub-page'));
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
            heartCatcherGame.keys[e.key] = true;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
            heartCatcherGame.keys[e.key] = false;
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        e.preventDefault();
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (!heartCatcherGame.gameRunning || heartCatcherGame.gameOver) return;
        
        const touchX = e.touches[0].clientX;
        const rect = canvas.getBoundingClientRect();
        const touchRelativeX = touchX - rect.left;
        
        heartCatcherGame.basket.x = touchRelativeX - heartCatcherGame.basket.width / 2;
        
        // Keep basket in bounds
        if (heartCatcherGame.basket.x < 0) heartCatcherGame.basket.x = 0;
        if (heartCatcherGame.basket.x > canvas.width - heartCatcherGame.basket.width) {
            heartCatcherGame.basket.x = canvas.width - heartCatcherGame.basket.width;
        }
        
        e.preventDefault();
    });
    
    // Draw initial state
    drawHeartCatcher();
}

function updateHeartCatcherDisplay() {
    document.getElementById('heart-catcher-score').textContent = heartCatcherGame.score;
    document.getElementById('heart-catcher-lives').textContent = heartCatcherGame.lives;
    document.getElementById('heart-catcher-high-score').textContent = heartCatcherGame.highScore;
}

function startHeartCatcher() {
    if (heartCatcherGame.gameOver) {
        restartHeartCatcher();
        return;
    }
    
    heartCatcherGame.gameRunning = true;
    heartCatcherGame.gameOver = false;
    document.getElementById('heart-catcher-game-over').style.display = 'none';
    
    if (!heartCatcherGame.animationId) {
        gameLoopHeartCatcher();
    }
    
    playSound('pop');
}

function pauseHeartCatcher() {
    heartCatcherGame.gameRunning = !heartCatcherGame.gameRunning;
    
    if (heartCatcherGame.gameRunning) {
        gameLoopHeartCatcher();
    } else {
        cancelAnimationFrame(heartCatcherGame.animationId);
        heartCatcherGame.animationId = null;
    }
    
    playSound('pop');
}

function restartHeartCatcher() {
    cancelAnimationFrame(heartCatcherGame.animationId);
    
    // Reset game state
    heartCatcherGame.score = 0;
    heartCatcherGame.lives = 3;
    heartCatcherGame.hearts = [];
    heartCatcherGame.goldenHearts = [];
    heartCatcherGame.particles = [];
    heartCatcherGame.speed = 2;
    heartCatcherGame.spawnRate = 1000;
    heartCatcherGame.gameRunning = false;
    heartCatcherGame.gameOver = false;
    heartCatcherGame.basket.x = heartCatcherGame.canvas.width / 2 - 40;
    
    // Update display
    updateHeartCatcherDisplay();
    document.getElementById('heart-catcher-game-over').style.display = 'none';
    
    // Redraw
    drawHeartCatcher();
    playSound('pop');
}

function gameLoopHeartCatcher() {
    if (!heartCatcherGame.gameRunning || heartCatcherGame.gameOver) return;
    
    const now = Date.now();
    
    // Spawn hearts
    if (now - heartCatcherGame.lastSpawn > heartCatcherGame.spawnRate) {
        spawnHeart();
        heartCatcherGame.lastSpawn = now;
        
        // Increase difficulty
        if (heartCatcherGame.score > 0 && heartCatcherGame.score % 10 === 0) {
            heartCatcherGame.speed = Math.min(heartCatcherGame.speed + 0.2, 6);
            heartCatcherGame.spawnRate = Math.max(heartCatcherGame.spawnRate - 50, 300);
        }
    }
    
    // Spawn golden heart randomly
    if (Math.random() < 0.005) {
        spawnGoldenHeart();
    }
    
    // Handle input
    handleInputHeartCatcher();
    
    // Update game state
    updateHeartCatcher();
    
    // Draw everything
    drawHeartCatcher();
    
    // Continue game loop
    heartCatcherGame.animationId = requestAnimationFrame(gameLoopHeartCatcher);
}

function handleInputHeartCatcher() {
    if (heartCatcherGame.keys['ArrowLeft'] || heartCatcherGame.keys['a']) {
        heartCatcherGame.basket.x -= heartCatcherGame.basket.speed;
    }
    if (heartCatcherGame.keys['ArrowRight'] || heartCatcherGame.keys['d']) {
        heartCatcherGame.basket.x += heartCatcherGame.basket.speed;
    }
    
    // Keep basket in bounds
    if (heartCatcherGame.basket.x < 0) heartCatcherGame.basket.x = 0;
    if (heartCatcherGame.basket.x > heartCatcherGame.canvas.width - heartCatcherGame.basket.width) {
        heartCatcherGame.basket.x = heartCatcherGame.canvas.width - heartCatcherGame.basket.width;
    }
}

function spawnHeart() {
    heartCatcherGame.hearts.push({
        x: Math.random() * (heartCatcherGame.canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: heartCatcherGame.speed + Math.random() * 1
    });
}

function spawnGoldenHeart() {
    heartCatcherGame.goldenHearts.push({
        x: Math.random() * (heartCatcherGame.canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: heartCatcherGame.speed * 1.5
    });
}

function updateHeartCatcher() {
    // Update hearts
    for (let i = heartCatcherGame.hearts.length - 1; i >= 0; i--) {
        const heart = heartCatcherGame.hearts[i];
        heart.y += heart.speed;
        
        // Check collision with basket
        if (heart.y + heart.height > heartCatcherGame.basket.y &&
            heart.x < heartCatcherGame.basket.x + heartCatcherGame.basket.width &&
            heart.x + heart.width > heartCatcherGame.basket.x) {
            
            // Catch heart
            heartCatcherGame.hearts.splice(i, 1);
            heartCatcherGame.score++;
            
            // Create particles
            createParticles(heart.x + heart.width/2, heart.y + heart.height/2, '❤', 10);
            
            // Update display
            updateHeartCatcherDisplay();
            
            // Play sound
            playSound('pop');
            
            continue;
        }
        
        // Remove heart if it falls off screen
        if (heart.y > heartCatcherGame.canvas.height) {
            heartCatcherGame.hearts.splice(i, 1);
            heartCatcherGame.lives--;
            updateHeartCatcherDisplay();
            
            if (heartCatcherGame.lives <= 0) {
                gameOverHeartCatcher();
            }
        }
    }
    
    // Update golden hearts
    for (let i = heartCatcherGame.goldenHearts.length - 1; i >= 0; i--) {
        const heart = heartCatcherGame.goldenHearts[i];
        heart.y += heart.speed;
        
        // Check collision with basket
        if (heart.y + heart.height > heartCatcherGame.basket.y &&
            heart.x < heartCatcherGame.basket.x + heartCatcherGame.basket.width &&
            heart.x + heart.width > heartCatcherGame.basket.x) {
            
            // Catch golden heart
            heartCatcherGame.goldenHearts.splice(i, 1);
            heartCatcherGame.score += 5;
            
            // Create particles
            createParticles(heart.x + heart.width/2, heart.y + heart.height/2, '💛', 15);
            
            // Update display
            updateHeartCatcherDisplay();
            
            // Play special sound
            playHeartCatcherSound('golden');
            
            continue;
        }
        
        // Remove golden heart if it falls off screen
        if (heart.y > heartCatcherGame.canvas.height) {
            heartCatcherGame.goldenHearts.splice(i, 1);
        }
    }
    
    // Update particles
    for (let i = heartCatcherGame.particles.length - 1; i >= 0; i--) {
        const particle = heartCatcherGame.particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if (particle.life <= 0) {
            heartCatcherGame.particles.splice(i, 1);
        }
    }
}

function createParticles(x, y, emoji, count) {
    for (let i = 0; i < count; i++) {
        heartCatcherGame.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            emoji: emoji,
            life: 30 + Math.random() * 30
        });
    }
}

function drawHeartCatcher() {
    const ctx = heartCatcherGame.ctx;
    const canvas = heartCatcherGame.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffe6f0');
    gradient.addColorStop(1, '#ffd6e7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw basket
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.roundRect(
        heartCatcherGame.basket.x,
        heartCatcherGame.basket.y,
        heartCatcherGame.basket.width,
        heartCatcherGame.basket.height,
        20
    );
    ctx.fill();
    
    // Draw basket handle
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(
        heartCatcherGame.basket.x + heartCatcherGame.basket.width / 2,
        heartCatcherGame.basket.y - 10,
        15,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw hearts
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    heartCatcherGame.hearts.forEach(heart => {
        ctx.fillStyle = '#ff6b9d';
        ctx.fillText('❤', heart.x + heart.width/2, heart.y + heart.height/2);
    });
    
    // Draw golden hearts
    heartCatcherGame.goldenHearts.forEach(heart => {
        ctx.fillStyle = '#FFD700';
        ctx.fillText('💛', heart.x + heart.width/2, heart.y + heart.height/2);
    });
    
    // Draw particles
    heartCatcherGame.particles.forEach(particle => {
        ctx.globalAlpha = particle.life / 60;
        ctx.fillStyle = particle.emoji === '💛' ? '#FFD700' : '#ff6b9d';
        ctx.fillText(particle.emoji, particle.x, particle.y);
        ctx.globalAlpha = 1;
    });
    
    // Draw score on canvas
    ctx.fillStyle = '#2a1a1f';
    ctx.font = 'bold 20px Nunito';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${heartCatcherGame.score}`, 20, 30);
    ctx.fillText(`Lives: ${heartCatcherGame.lives}`, 20, 60);
}

function playHeartCatcherSound(type) {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (type === 'golden') {
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator1.frequency.value = 659.25; // E5
            oscillator2.frequency.value = 830.61; // G#5
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.3);
            oscillator2.stop(audioContext.currentTime + 0.3);
        }
    } catch (e) {
        console.log("Audio not supported");
    }
}function gameOverHeartCatcher() {
    heartCatcherGame.gameRunning = false;
    heartCatcherGame.gameOver = true;
    
    cancelAnimationFrame(heartCatcherGame.animationId);
    heartCatcherGame.animationId = null;
    
    // Update high score
    if (heartCatcherGame.score > heartCatcherGame.highScore) {
        heartCatcherGame.highScore = heartCatcherGame.score;
        localStorage.setItem('heartCatcherHighScore', heartCatcherGame.highScore.toString());
        updateHeartCatcherDisplay();
    }
    
    // Show game over screen
    document.getElementById('final-score').textContent = heartCatcherGame.score;
    
    // Set message based on score
    let message = "My heart will always be yours ❤️";
    if (heartCatcherGame.score >= 50) {
        message = "You caught so many hearts, just like you caught mine! 💘";
    } else if (heartCatcherGame.score >= 30) {
        message = "Amazing! You're a heart-catching expert! 😍";
    } else if (heartCatcherGame.score >= 20) {
        message = "Great job! You really know how to catch hearts! 💕";
    }
    
    document.getElementById('heart-catcher-message').textContent = message;
    document.getElementById('heart-catcher-game-over').style.display = 'flex';
    
    createSparkleBurst();
}

/* ========== GAME 2: MEMORY MATCH ========== */
let memoryGame = null;

function initMemoryGame() {
    // Card emojis (8 pairs)
    const cardEmojis = ['❤️', '💕', '💖', '💗', '💘', '💝', '💓', '💞'];
    
    // Game state
    memoryGame = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: cardEmojis.length,
        moves: 0,
        startTime: 0,
        elapsedTime: 0,
        gameRunning: false,
        timerInterval: null,
        canFlip: true
    };
    
    // Create cards array (duplicate each emoji for pairs)
    memoryGame.cards = [...cardEmojis, ...cardEmojis]
        .map(emoji => ({ emoji, flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5); // Shuffle
    
    // Render cards
    renderMemoryCards();
    
    // Update display
    updateMemoryDisplay();
    
    // Event listeners
    document.getElementById('memory-start').addEventListener('click', startMemoryGame);
    document.getElementById('memory-restart').addEventListener('click', restartMemoryGame);
    document.getElementById('memory-replay').addEventListener('click', restartMemoryGame);
    document.getElementById('memory-back-from-complete').addEventListener('click', () => navigateTo('games-hub-page'));
}

function renderMemoryCards() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    
    memoryGame.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        if (card.flipped || card.matched) {
            cardElement.classList.add('flipped');
            cardElement.textContent = card.emoji;
        } else {
            cardElement.textContent = '❤';
        }
        
        if (card.matched) {
            cardElement.classList.add('matched');
        }
        
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', () => flipCard(index));
        grid.appendChild(cardElement);
    });
}

function updateMemoryDisplay() {
    document.getElementById('memory-moves').textContent = memoryGame.moves;
    document.getElementById('memory-time').textContent = Math.floor(memoryGame.elapsedTime / 1000);
    document.getElementById('memory-pairs').textContent = memoryGame.matchedPairs;
}

function startMemoryGame() {
    if (!memoryGame.gameRunning) {
        memoryGame.gameRunning = true;
        memoryGame.startTime = Date.now() - memoryGame.elapsedTime;
        
        memoryGame.timerInterval = setInterval(() => {
            memoryGame.elapsedTime = Date.now() - memoryGame.startTime;
            updateMemoryDisplay();
        }, 100);
        
        playSound('pop');
    }
}

function restartMemoryGame() {
    clearInterval(memoryGame.timerInterval);
    
    // Reset game state
    const cardEmojis = ['❤️', '💕', '💖', '💗', '💘', '💝', '💓', '💞'];
    memoryGame.cards = [...cardEmojis, ...cardEmojis]
        .map(emoji => ({ emoji, flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5);
    
    memoryGame.flippedCards = [];
    memoryGame.matchedPairs = 0;
    memoryGame.moves = 0;
    memoryGame.elapsedTime = 0;
    memoryGame.gameRunning = false;
    memoryGame.canFlip = true;
    
    // Hide game complete screen
    document.getElementById('memory-game-complete').style.display = 'none';
    
    // Re-render
    renderMemoryCards();
    updateMemoryDisplay();
    playSound('pop');
}

function flipCard(index) {
    if (!memoryGame.gameRunning) {
        startMemoryGame();
        return;
    }
    
    const card = memoryGame.cards[index];
    
    if (!memoryGame.canFlip || card.flipped || card.matched) return;
    
    // Flip the card
    card.flipped = true;
    renderMemoryCards();
    playSound('pop');
    
    // Add to flipped cards
    memoryGame.flippedCards.push(index);
    
    // Check for match
    if (memoryGame.flippedCards.length === 2) {
        memoryGame.moves++;
        updateMemoryDisplay();
        
        const [firstIndex, secondIndex] = memoryGame.flippedCards;
        const firstCard = memoryGame.cards[firstIndex];
        const secondCard = memoryGame.cards[secondIndex];
        
        memoryGame.canFlip = false;
        
        if (firstCard.emoji === secondCard.emoji) {
            // Match found
            firstCard.matched = true;
            secondCard.matched = true;
            memoryGame.matchedPairs++;
            updateMemoryDisplay();
            
            // Play match sound
            playMemoryMatchSound('match');
            
            // Check for game completion
            if (memoryGame.matchedPairs === memoryGame.totalPairs) {
                setTimeout(() => {
                    memoryGame.gameRunning = false;
                    clearInterval(memoryGame.timerInterval);
                    
                    // Save best time if better than previous
                    const currentTime = Math.floor(memoryGame.elapsedTime / 1000);
                    const bestTime = parseInt(localStorage.getItem('memoryBestTime')) || 9999;
                    const bestMoves = parseInt(localStorage.getItem('memoryBestMoves')) || 9999;
                    
                    if (currentTime < bestTime) {
                        localStorage.setItem('memoryBestTime', currentTime.toString());
                    }
                    if (memoryGame.moves < bestMoves) {
                        localStorage.setItem('memoryBestMoves', memoryGame.moves.toString());
                    }
                    
                    document.getElementById('final-memory-time').textContent = currentTime;
                    document.getElementById('final-memory-moves').textContent = memoryGame.moves;
                    document.getElementById('memory-game-complete').style.display = 'flex';
                    createSparkleBurst();
                }, 500);
            }
            
            memoryGame.flippedCards = [];
            memoryGame.canFlip = true;
        } else {
            // No match, flip back after delay
            setTimeout(() => {
                firstCard.flipped = false;
                secondCard.flipped = false;
                memoryGame.flippedCards = [];
                memoryGame.canFlip = true;
                renderMemoryCards();
            }, 1000);
        }
    }
}

function playMemoryMatchSound(type) {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (type === 'match') {
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator1.frequency.value = 523.25; // C5
            oscillator2.frequency.value = 659.25; // E5
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.5);
            oscillator2.stop(audioContext.currentTime + 0.5);
        }
    } catch (e) {
        console.log("Audio not supported");
    }
}

/* ========== GAME 3: LOVE QUEST ========== */
let loveQuestGame = null;

function initLoveQuest() {
    // Story structure
    const story = [
        {
            text: "Hello my love! Let's go on a little adventure together. Our story begins on a beautiful Valentine's Day...",
            choices: [
                { text: "Hold your hand and walk together", next: 1 },
                { text: "Give you a surprise hug", next: 2 },
                { text: "Whisper something sweet in your ear", next: 3 }
            ]
        },
        {
            text: "We're walking through a beautiful park filled with flowers. The sun is shining and birds are singing. What should we do next?",
            choices: [
                { text: "Pick some flowers for you", next: 4 },
                { text: "Find a bench to sit and talk", next: 5 },
                { text: "Take a cute selfie together", next: 6 }
            ]
        },
        {
            text: "You gave me the warmest hug! I can feel your heartbeat against mine. What happens next?",
            choices: [
                { text: "Look into your eyes and smile", next: 7 },
                { text: "Whisper 'I love you'", next: 8 },
                { text: "Give you a gentle forehead kiss", next: 9 }
            ]
        },
        {
            text: "I whispered 'You make every day special' and you blushed. What should we do now?",
            choices: [
                { text: "Go for ice cream together", next: 10 },
                { text: "Watch the sunset", next: 11 },
                { text: "Dance together right here", next: 12 }
            ]
        }
    ];
    
    // Endings
    const endings = {
        4: "We picked beautiful flowers together. You made a cute bouquet and said 'Every flower reminds me of you - beautiful and unique.'",
        5: "We found a quiet bench and talked for hours. You shared your dreams and I shared mine. Our hearts connected even more.",
        6: "We took the cutest selfie! Your smile in that photo is my favorite thing. I made it my phone wallpaper.",
        7: "Looking into your eyes, I saw my future. You smiled back and I knew this was where I belonged.",
        8: "When I whispered 'I love you', you hugged me tighter and whispered 'I love you more' back.",
        9: "The gentle kiss on your forehead made you blush. You leaned in and gave me the sweetest kiss.",
        10: "We shared ice cream, laughing when it dripped. You wiped my chin and said 'You're so cute when you're messy.'",
        11: "Watching the sunset, you leaned your head on my shoulder. The sky turned pink and orange, matching our love.",
        12: "We danced without music, just our hearts beating in rhythm. It was the most perfect dance of my life."
    };
    
    // Game state
    loveQuestGame = {
        story: story,
        endings: endings,
        currentStep: 0,
        currentEnding: null
    };
    
    // Render initial story
    renderLoveQuest();
    
    // Event listeners
    document.getElementById('love-quest-restart').addEventListener('click', restartLoveQuest);
    document.getElementById('love-quest-replay').addEventListener('click', restartLoveQuest);
    document.getElementById('love-quest-back-from-ending').addEventListener('click', () => {
        document.getElementById('love-quest-ending').style.display = 'none';
        restartLoveQuest();
    });
    
    // Choice event listener
    document.getElementById('story-choices').addEventListener('click', (e) => {
        const choiceBtn = e.target.closest('.story-choice');
        if (choiceBtn) {
            const choiceIndex = parseInt(choiceBtn.dataset.choice) - 1;
            makeChoice(choiceIndex);
        }
    });
}

function renderLoveQuest() {
    const currentStep = loveQuestGame.story[loveQuestGame.currentStep];
    
    if (!currentStep) {
        // Show ending
        const endingText = loveQuestGame.endings[loveQuestGame.currentEnding] || 
            "No matter the path, I still choose you. Every moment with you is special.";
        
        document.getElementById('ending-message').textContent = endingText;
        document.getElementById('love-quest-ending').style.display = 'flex';
        createSparkleBurst();
        return;
    }
    
    // Update story text with typewriter effect
    const storyText = document.getElementById('story-text');
    storyText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < currentStep.text.length) {
            storyText.textContent += currentStep.text.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    };
    typeWriter();
    
    // Update choices
    const choicesContainer = document.getElementById('story-choices');
    choicesContainer.innerHTML = '';
    
    currentStep.choices.forEach((choice, index) => {
        const choiceBtn = document.createElement('button');
        choiceBtn.className = 'story-choice';
        choiceBtn.dataset.choice = index + 1;
        choiceBtn.textContent = choice.text;
        choicesContainer.appendChild(choiceBtn);
    });
}

function makeChoice(choiceIndex) {
    const currentStep = loveQuestGame.story[loveQuestGame.currentStep];
    
    if (!currentStep || choiceIndex >= currentStep.choices.length) return;
    
    const choice = currentStep.choices[choiceIndex];
    loveQuestGame.currentStep = choice.next;
    loveQuestGame.currentEnding = choice.next;
    
    playSound('pop');
    renderLoveQuest();
}

function restartLoveQuest() {
    loveQuestGame.currentStep = 0;
    loveQuestGame.currentEnding = null;
    document.getElementById('love-quest-ending').style.display = 'none';
    renderLoveQuest();
    playSound('pop');
}

/* ========== GAME 4: RHYTHM TAP ========== */
let rhythmGame = null;

function initRhythmTap() {
    // Game state
    rhythmGame = {
        hearts: [],
        score: 0,
        combo: 0,
        accuracy: 100,
        hits: 0,
        total: 0,
        gameRunning: false,
        startTime: 0,
        gameDuration: 30000, // 30 seconds
        spawnInterval: null,
        gameLoopInterval: null,
        lanes: [1, 2, 3, 4]
    };
    
    // Update display
    updateRhythmDisplay();
    
    // Event listeners
    document.getElementById('rhythm-start').addEventListener('click', startRhythmGame);
    document.getElementById('rhythm-replay').addEventListener('click', restartRhythmGame);
    document.getElementById('rhythm-back-from-complete').addEventListener('click', () => navigateTo('games-hub-page'));
    
    // Lane tap events (fixed - attach to each lane)
    document.querySelectorAll('.rhythm-lane').forEach(lane => {
        lane.addEventListener('click', function(e) {
            if (!rhythmGame.gameRunning) return;
            const laneNum = parseInt(this.dataset.lane);
            const rect = this.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            checkTap(laneNum, clickY);
        });
    });
    
    // Touch events for mobile
    document.querySelectorAll('.rhythm-lane').forEach(lane => {
        lane.addEventListener('touchstart', function(e) {
            if (!rhythmGame.gameRunning) return;
            const laneNum = parseInt(this.dataset.lane);
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            const touchY = touch.clientY - rect.top;
            checkTap(laneNum, touchY);
            e.preventDefault();
        });
    });
}

function updateRhythmDisplay() {
    document.getElementById('rhythm-score').textContent = rhythmGame.score;
    document.getElementById('rhythm-combo').textContent = rhythmGame.combo;
    document.getElementById('rhythm-accuracy').textContent = Math.round(rhythmGame.accuracy);
}

function startRhythmGame() {
    if (rhythmGame.gameRunning) return;
    
    rhythmGame.gameRunning = true;
    rhythmGame.startTime = Date.now();
    rhythmGame.score = 0;
    rhythmGame.combo = 0;
    rhythmGame.accuracy = 100;
    rhythmGame.hits = 0;
    rhythmGame.total = 0;
    rhythmGame.hearts = [];
    
    updateRhythmDisplay();
    
    // Clear any existing hearts
    document.querySelectorAll('.rhythm-heart').forEach(heart => heart.remove());
    
    // Start spawning hearts
    rhythmGame.spawnInterval = setInterval(spawnRhythmHeart, 800);
    
    // Start game loop
    rhythmGame.gameLoopInterval = setInterval(gameLoopRhythm, 16);
    
    // End game after duration
    setTimeout(endRhythmGame, rhythmGame.gameDuration);
    
    playSound('pop');
}

function restartRhythmGame() {
    endRhythmGame();
    document.getElementById('rhythm-game-complete').style.display = 'none';
    startRhythmGame();
}

function spawnRhythmHeart() {
    if (!rhythmGame.gameRunning) return;
    
    const lane = rhythmGame.lanes[Math.floor(Math.random() * rhythmGame.lanes.length)];
    const speed = 2 + Math.random() * 2;
    
    const heart = {
        lane: lane,
        y: -50,
        speed: speed,
        hit: false,
        element: null
    };
    
    rhythmGame.hearts.push(heart);
    rhythmGame.total++;
    
    // Create visual element
    const laneElement = document.querySelector(`.rhythm-lane[data-lane="${lane}"]`);
    const heartElement = document.createElement('div');
    heartElement.className = 'rhythm-heart';
    heartElement.style.bottom = `${heart.y}px`;
    heartElement.textContent = '❤';
    laneElement.appendChild(heartElement);
    
    heart.element = heartElement;
}

function gameLoopRhythm() {
    if (!rhythmGame.gameRunning) return;
    
    // Update heart positions
    rhythmGame.hearts.forEach(heart => {
        if (!heart.hit && heart.element) {
            heart.y += heart.speed;
            heart.element.style.bottom = `${heart.y}px`;
            
            // Remove hearts that passed the hit line without being hit
            if (heart.y > 300 && !heart.hit) {
                heart.element.remove();
                heart.hit = true;
                rhythmGame.combo = 0;
                updateRhythmDisplay();
            }
        }
    });
    
    // Clean up hit hearts
    rhythmGame.hearts = rhythmGame.hearts.filter(heart => heart.y < 350);
}

function checkTap(laneNum, tapY) {
    if (!rhythmGame.gameRunning) return;
    
    // Find heart in this lane closest to hit line (100px from bottom)
    let closestHeart = null;
    let closestDistance = Infinity;
    
    rhythmGame.hearts.forEach(heart => {
        if (heart.lane === laneNum && !heart.hit) {
            const distance = Math.abs(heart.y - 100); // Hit line is at 100px from top
            if (distance < closestDistance && distance < 50) {
                closestDistance = distance;
                closestHeart = heart;
            }
        }
    });
    
    if (closestHeart) {
        // Hit!
        closestHeart.hit = true;
        rhythmGame.hits++;
        
        // Remove heart element
        if (closestHeart.element) {
            closestHeart.element.remove();
        }
        
        // Calculate score based on accuracy
        let points = 0;
        
        if (closestDistance < 15) {
            points = 100;
            rhythmGame.combo++;
        } else if (closestDistance < 30) {
            points = 50;
            rhythmGame.combo++;
        } else {
            points = 10;
            rhythmGame.combo = 0;
        }
        
        rhythmGame.score += points * (1 + rhythmGame.combo * 0.1);
        rhythmGame.accuracy = (rhythmGame.hits / rhythmGame.total) * 100;
        
        updateRhythmDisplay();
        
        // Create hit effect
        createRhythmHitEffect(laneNum, tapY);
        
        // Play sound
        playSound('pop');
    } else {
        // Miss
        rhythmGame.combo = 0;
        updateRhythmDisplay();
    }
}

function createRhythmHitEffect(laneNum, y) {
    const lane = document.querySelector(`.rhythm-lane[data-lane="${laneNum}"]`);
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: absolute;
        left: 50%;
        top: ${y}px;
        transform: translate(-50%, -50%);
        font-size: 30px;
        color: #ff6b9d;
        pointer-events: none;
        z-index: 10;
        animation: pop 0.5s ease-out;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    effect.textContent = rhythmGame.combo > 5 ? 'PERFECT! 💖' : 'GOOD! ❤️';
    lane.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
        document.head.removeChild(style);
    }, 500);
}

function endRhythmGame() {
    rhythmGame.gameRunning = false;
    
    clearInterval(rhythmGame.spawnInterval);
    clearInterval(rhythmGame.gameLoopInterval);
    
    // Clear all hearts
    document.querySelectorAll('.rhythm-heart').forEach(heart => heart.remove());
    
    // Calculate rank
    let rank = 'C';
    if (rhythmGame.score > 5000) rank = 'S';
    else if (rhythmGame.score > 3000) rank = 'A';
    else if (rhythmGame.score > 1500) rank = 'B';
    
    // Save high score
    const currentHigh = parseInt(localStorage.getItem('rhythmHighScore')) || 0;
    if (rhythmGame.score > currentHigh) {
        localStorage.setItem('rhythmHighScore', Math.round(rhythmGame.score).toString());
    }
    
    // Show results
    document.getElementById('rhythm-rank').textContent = rank;
    document.getElementById('final-rhythm-score').textContent = Math.round(rhythmGame.score);
    document.getElementById('rhythm-game-complete').style.display = 'flex';
    
    createSparkleBurst();
}
