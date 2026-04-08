document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });


    // Get the modal and buttons
    const onboardingModal = document.getElementById('onboardingModal');
    const startOnboardingBtn = document.getElementById('start-onboarding-btn');
    const closeButton = document.querySelector('.close-button');
    const onboardingChat = document.getElementById('onboarding-chat');
    const onboardingInput = document.getElementById('onboardingInput');
    const sendOnboardingBtn = document.getElementById('sendOnboardingBtn');
    const onboardingInputArea = document.getElementById('onboardingInputArea');
    const onboardingForm = document.getElementById('onboardingForm');

    // Hero Chat Elements
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    let onboardingStep = 0;
    const onboardingQuestions = [
        "¡Hola, soy tu asistente de Apuntao! Para empezar, ¿cuál es tu nombre?",
        "Encantado, [nombre_usuario]. ¿Puedes decirme el nombre de tu negocio o restaurante?",
        "Perfecto, [nombre_negocio]. ¿Qué tipo de negocio tienes (ej: restaurante, beach club, hotel)?",
        "Excelente. Y para entender mejor cómo ayudarte, ¿qué tareas o procesos te gustaría automatizar o mejorar con un asistente de IA?",
        "Genial. Con esta información, podemos empezar a configurar tu asistente. Por favor, rellena el siguiente formulario para que Leroy pueda contactarte y dar los últimos toques."
    ];
    let userResponses = {};

    // Function to add a message to the chat
    function addMessage(chatElement, message, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.textContent = message;
        chatElement.appendChild(msgDiv);
        chatElement.scrollTop = chatElement.scrollHeight;
    }

    // Function to add a message to the onboarding chat
    function addOnboardingMessage(message, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('onboarding-message', sender);
        msgDiv.textContent = message;
        onboardingChat.appendChild(msgDiv);
        onboardingChat.scrollTop = onboardingChat.scrollHeight;
    }

    // Onboarding Chat Logic
    function startOnboardingChat() {
        onboardingStep = 0;
        userResponses = {};
        onboardingChat.innerHTML = ''; // Clear previous messages
        onboardingInputArea.classList.remove('hidden');
        onboardingForm.classList.add('hidden');
        
        setTimeout(() => {
            addOnboardingMessage(onboardingQuestions[onboardingStep], 'assistant');
        }, 500);
    }

    sendOnboardingBtn.addEventListener('click', () => {
        const userInput = onboardingInput.value.trim();
        if (userInput === '') return;

        addOnboardingMessage(userInput, 'user');
        onboardingInput.value = '';

        switch (onboardingStep) {
            case 0:
                userResponses.name = userInput;
                onboardingQuestions[1] = onboardingQuestions[1].replace('[nombre_usuario]', userInput);
                break;
            case 1:
                userResponses.business_name = userInput;
                onboardingQuestions[2] = onboardingQuestions[2].replace('[nombre_negocio]', userInput);
                break;
            case 2:
                userResponses.business_type = userInput;
                break;
            case 3:
                userResponses.automation_needs = userInput;
                break;
        }

        onboardingStep++;

        if (onboardingStep < onboardingQuestions.length) {
            setTimeout(() => {
                addOnboardingMessage(onboardingQuestions[onboardingStep], 'assistant');
            }, 500);
        } else {
            // End of onboarding chat, show the form
            onboardingInputArea.classList.add('hidden');
            onboardingForm.classList.remove('hidden');
            document.getElementById('form-name').value = userResponses.name || '';
            document.getElementById('form-business').value = userResponses.business_type || '';
            document.getElementById('form-needs').value = userResponses.automation_needs || '';
        }
    });

    // Hero Chat Simulation (Example)
    const heroChatMessages = [
        { sender: 'assistant', text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
        { sender: 'user', text: "Necesito reservar una mesa para 2 personas el sábado." },
        { sender: 'assistant', text: "Claro. ¿A qué hora sería y para qué restaurante?" },
        { sender: 'user', text: "Para el Restaurante Can Pep, a las 21:00." },
        { sender: 'assistant', text: "Perfecto, mesa para 2 en Can Pep el sábado a las 21:00. ¿Algún nombre para la reserva?" },
        { sender: 'user', text: "Sí, a nombre de Leroy Löwe." },
        { sender: 'assistant', text: "Confirmado, mesa para 2 a nombre de Leroy Löwe en Restaurante Can Pep para el sábado a las 21:00. ¡Disfruten!" }
    ];

    let heroChatIndex = 0;

    function startHeroChatSimulation() {
        chatMessages.innerHTML = ''; // Clear existing messages
        heroChatIndex = 0;
        displayNextHeroMessage();
    }

    function displayNextHeroMessage() {
        if (heroChatIndex < heroChatMessages.length) {
            const message = heroChatMessages[heroChatIndex];
            setTimeout(() => {
                addMessage(chatMessages, message.text, message.sender);
                heroChatIndex++;
                displayNextHeroMessage(); // Continue with the next message
            }, 1500);
        } else {
            // Restart the simulation after some delay
            setTimeout(startHeroChatSimulation, 5000);
        }
    }

    startHeroChatSimulation(); // Start simulation on load

    sendChatBtn.addEventListener('click', () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;
        addMessage(chatMessages, userMessage, 'user');
        chatInput.value = '';
        // In a real scenario, this would send to an LLM
        setTimeout(() => {
            addMessage(chatMessages, "Gracias por tu mensaje. Un asistente de verdad respondería en segundos.", 'assistant');
        }, 1000);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatBtn.click();
        }
    });


    // Event listeners for modal
    startOnboardingBtn.addEventListener('click', () => {
        onboardingModal.style.display = 'flex'; // Show modal
        startOnboardingChat();
    });

    closeButton.addEventListener('click', () => {
        onboardingModal.style.display = 'none'; // Hide modal
    });

    window.addEventListener('click', (event) => {
        if (event.target == onboardingModal) {
            onboardingModal.style.display = 'none';
        }
    });

    // Form Submission (to email)
    onboardingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const businessType = document.getElementById('form-business').value;
        const automationNeeds = document.getElementById('form-needs').value;

        const subject = `Nuevo Onboarding Apuntao: ${name} (${businessType})`;
        const body = `Hola Leroy,

Has recibido un nuevo onboarding de Apuntao con los siguientes detalles:

Nombre: ${name}
Email: ${email}
Tipo de Negocio: ${businessType}
Necesidades de Automatización: ${automationNeeds}

Un saludo, 
Tu asistente Dioxyz (desde la web de Apuntao)`;

        // Using mailto to send email
        const mailtoLink = `mailto:contacto@lr0y.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        alert('¡Gracias! Tu información de onboarding ha sido enviada a Leroy.');
        onboardingModal.style.display = 'none';
    });

});
