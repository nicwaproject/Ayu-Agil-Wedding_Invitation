document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById('openButton');
    const cover = document.getElementById('cover');
    const invitation = document.getElementById('invitation');
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false;

    openButton.addEventListener('click', function() {
        cover.style.display = 'none';
        invitation.style.display = 'block';
        document.body.style.overflow = 'auto'; // Enable scrolling when invitation is opened
        document.documentElement.style.overflow = 'auto'; // Enable scrolling when invitation is opened
        music.play().then(() => {
            isPlaying = true;
            musicIcon.src = 'pause.png'; // Update icon to pause
        }).catch(error => {
            console.log("Music play was prevented:", error);
        });

        // Show each section in sequence
        const sections = invitation.getElementsByClassName('section');
        let index = 0;

        function showNextSection() {
            if (index < sections.length) {
                sections[index].style.display = 'flex';
                index++;
                setTimeout(showNextSection, 1000); // Adjust the timing as needed
            }
        }

        showNextSection();
    });

    // Function to get query parameter from URL
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get guest's name from URL and update the guestName element if available
    const guestName = getQueryParam('guestName');
    if (guestName) {
        const guestNameElement = document.getElementById('guestName');
        guestNameElement.textContent = guestName;
    }

    // Countdown logic for section 2
    const countdownElement = document.getElementById('countdown');
    const targetDate = new Date('2024-06-28T16:00:00'); // Adjust the target date and time

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            countdownElement.innerHTML = 'The wedding is happening now!';
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('daysNum').textContent = days;
            document.getElementById('hoursNum').textContent = hours;
            document.getElementById('minutesNum').textContent = minutes;
            document.getElementById('secondsNum').textContent = seconds;
        }
    }

    setInterval(updateCountdown, 1000); // Update the countdown every second

    // Image Carousel
    const images = document.querySelectorAll(".image-container img");
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    // Initialize first image
    images.forEach((img, index) => {
        if (index !== 0) img.classList.remove('active');
    });
    images[0].classList.add('active');

    setInterval(showNextImage, 2000); // Change image every 2 seconds

    // Form Submission Logic
    document.getElementById('rsvpMessageForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Simple validation
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const attendance = document.getElementById('attendance').value;
        const guests = document.getElementById('guests').value;
        const message = document.getElementById('messageContent').value;

        if (name && email && attendance && guests && message) {
            // Send data to the server
            fetch('https://reservation-message-handler.glitch.me/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    attendance: attendance,
                    guests: guests,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                alert('Thank you for your response!');
                // Clear the form
                document.getElementById('rsvpMessageForm').reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your form.');
            });
        } else {
            alert('Please fill out all required fields.');
        }
    });

    // Swiper Carousel
    var carousels = document.querySelectorAll('.swiper-container');
    carousels.forEach(function(carousel) {
        new Swiper(carousel, {
            loop: true,
            pagination: {
                el: carousel.querySelector('.swiper-pagination'),
                clickable: true,
            },
            navigation: {
                nextEl: carousel.querySelector('.swiper-button-next'),
                prevEl: carousel.querySelector('.swiper-button-prev'),
            },
            autoplay: {
                delay: 3000, // Adjust delay as needed
                disableOnInteraction: false,
            },
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elements = document.querySelectorAll('.fade-in, .fade-slide');
    elements.forEach(element => {
        observer.observe(element);
    });

    // Music Control
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            music.pause();
            musicIcon.src = 'play.png';
        } else {
            music.play();
            musicIcon.src = 'pause.png';
        }
        isPlaying = !isPlaying;
    });
});

function copyAccountNumber(elementId) {
    const accountNumber = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(accountNumber).then(() => {
        alert('Account number copied to clipboard!');
    }).catch(err => {
        console.error('Error copying account number: ', err);
    });
}
