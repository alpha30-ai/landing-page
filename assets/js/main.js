// Helpers
const qs = (s,root=document)=>root.querySelector(s);
const qsa = (s,root=document)=>[...root.querySelectorAll(s)];

// Ensure proper Arabic text rendering
document.addEventListener('DOMContentLoaded', ()=>{
  // Set document direction
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');

  // Add Arabic text class to all text elements
  const textElements = qsa('p, h1, h2, h3, h4, h5, h6, span, div, li, a, label, button');
  textElements.forEach(el => {
    if(el.textContent.trim() && /[\u0600-\u06FF]/.test(el.textContent)){
      el.classList.add('arabic-text');
    }
  });

  // Fix any remaining RTL issues
  const containers = qsa('.container, .container-fluid, .container-xxl');
  containers.forEach(container => {
    container.style.direction = 'rtl';
  });

  // Ensure forms are RTL
  const forms = qsa('form');
  forms.forEach(form => {
    form.style.direction = 'rtl';
    form.style.textAlign = 'right';
  });

  // Fix input placeholders
  const inputs = qsa('input[placeholder], textarea[placeholder]');
  inputs.forEach(input => {
    input.style.direction = 'rtl';
    input.style.textAlign = 'right';
  });
});

// Year in footer
qs('#year').textContent = new Date().getFullYear();

// Sticky navbar effect on scroll
const nav = qs('#mainNav');
let ticking = false;
const onScroll = ()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      if(window.scrollY>50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      ticking = false;
    });
    ticking = true;
  }
};
window.addEventListener('scroll', onScroll);
onScroll();

// Reveal on scroll with staggered animation
const revealEls = qsa('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e, index)=>{
    if(e.isIntersecting){
      setTimeout(()=>{
        e.target.classList.add('visible');
      }, index * 100);
      io.unobserve(e.target);
    }
  });
},{threshold:.1, rootMargin: '0px 0px -50px 0px'});
revealEls.forEach(el=>io.observe(el));

// Generate portfolio cards with placeholder images
(function buildPortfolio(){
  const template = qs('#portfolio-card-template');
  if(!template) return;
  const urls = [
    'https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=800&q=60'
  ];
  const row = template.parentElement;
  urls.forEach(u=>{
    const frag = template.content.cloneNode(true);
    const img = qs('img', frag);
    img.src = u; img.alt = 'عمل من أعمالنا';
    row.appendChild(frag);
  });
})();

// Smooth scroll for nav links
qsa('a.nav-link, .navbar .btn, a.btn').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#') && href.length>1){
      const target = qs(href);
      if(target){
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({top: offsetTop, behavior:'smooth'});

        // Close mobile menu if open
        const navCollapse = qs('.navbar-collapse');
        if(navCollapse && navCollapse.classList.contains('show')){
          bootstrap.Collapse.getInstance(navCollapse)?.hide();
        }
      }
    }
  });
});

// Form submission handler
const contactForm = qs('footer form');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const btn = qs('button[type="submit"]', contactForm);
    const originalText = btn.textContent;

    btn.textContent = 'جاري الإرسال...';
    btn.disabled = true;

    // Simulate form submission
    setTimeout(()=>{
      btn.textContent = 'تم الإرسال ✓';
      btn.style.background = 'linear-gradient(90deg, #28a745, #20c997)';

      setTimeout(()=>{
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 2000);
    }, 1500);
  });
}

// Add loading states and error handling for images
qsa('img').forEach(img=>{
  img.addEventListener('load', ()=>{
    img.style.opacity = '1';
  });
  img.addEventListener('error', ()=>{
    img.style.opacity = '0.5';
    img.alt = 'فشل تحميل الصورة';
  });
});

// Parallax effect for hero background
window.addEventListener('scroll', ()=>{
  const scrolled = window.pageYOffset;
  const heroBackground = qs('.hero-bg');
  if(heroBackground && scrolled < window.innerHeight){
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Counter animation for stats
const animateCounters = ()=>{
  const counters = qsa('.stat-number[data-count]');
  counters.forEach(counter=>{
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = ()=>{
      current += increment;
      if(current < target){
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    updateCounter();
  });
};

// Trigger counter animation when stats section is visible
const statsSection = qs('#stats, .stat-item');
if(statsSection){
  const statsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});

  const statsContainer = qs('.stat-item').closest('section') || qs('.stat-item').closest('.container-xxl');
  if(statsContainer) statsObserver.observe(statsContainer);
}

// Service card interactions
qsa('.service-card').forEach(card=>{
  card.addEventListener('mouseenter', ()=>{
    card.style.transform = 'translateY(-10px) scale(1.02)';
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = '';
  });
});

// Pricing card selection
qsa('.pricing-card .btn').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const card = btn.closest('.pricing-card');
    const title = qs('.card-title', card).textContent;

    // Scroll to contact form
    const contactForm = qs('#contact');
    if(contactForm){
      contactForm.scrollIntoView({behavior: 'smooth'});

      // Pre-fill form with selected package
      setTimeout(()=>{
        const messageField = qs('textarea', contactForm);
        if(messageField){
          messageField.value = `أرغب في الاستفسار عن ${title}`;
          messageField.focus();
        }
      }, 1000);
    }
  });
});

// Blog card hover effects
qsa('.blog-card').forEach(card=>{
  card.addEventListener('mouseenter', ()=>{
    const img = qs('img', card);
    if(img) img.style.transform = 'scale(1.1)';
  });
  card.addEventListener('mouseleave', ()=>{
    const img = qs('img', card);
    if(img) img.style.transform = '';
  });
});

// Team card social links
qsa('.team-card').forEach(card=>{
  const socialLinks = qsa('.social-links a', card);
  socialLinks.forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      // Add your social media links here
      console.log('Social link clicked:', link.getAttribute('aria-label'));
    });
  });
});

// Enhanced form validation
const enhanceForm = ()=>{
  const form = qs('footer form');
  if(!form) return;

  const inputs = qsa('input, textarea', form);
  inputs.forEach(input=>{
    input.addEventListener('blur', ()=>{
      if(input.hasAttribute('required') && !input.value.trim()){
        input.style.borderColor = '#dc3545';
        input.style.boxShadow = '0 0 0 0.2rem rgba(220,53,69,.25)';
      } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }
    });

    input.addEventListener('input', ()=>{
      if(input.style.borderColor === 'rgb(220, 53, 69)'){
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }
    });
  });
};

enhanceForm();

// Add loading animation to buttons
qsa('.btn').forEach(btn=>{
  btn.addEventListener('click', function(e){
    if(!this.classList.contains('loading')){
      this.classList.add('loading');
      setTimeout(()=>{
        this.classList.remove('loading');
      }, 2000);
    }
  });
});

// Pricing toggle functionality
const pricingToggle = ()=>{
  const monthlyRadio = qs('#monthly');
  const yearlyRadio = qs('#yearly');
  const monthlyPrices = qsa('.price-monthly');
  const yearlyPrices = qsa('.price-yearly');

  const togglePricing = ()=>{
    if(yearlyRadio.checked){
      monthlyPrices.forEach(p => p.style.display = 'none');
      yearlyPrices.forEach(p => p.style.display = 'block');
    } else {
      monthlyPrices.forEach(p => p.style.display = 'block');
      yearlyPrices.forEach(p => p.style.display = 'none');
    }
  };

  if(monthlyRadio && yearlyRadio){
    monthlyRadio.addEventListener('change', togglePricing);
    yearlyRadio.addEventListener('change', togglePricing);
  }
};

pricingToggle();

// Enhanced pricing card interactions
qsa('.pricing-btn').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const card = btn.closest('.pricing-card');
    const plan = btn.getAttribute('data-plan');
    const planName = qs('.pricing-title', card).textContent;
    const planPrice = qs('.amount', card).textContent;
    const isYearly = qs('#yearly').checked;
    const period = isYearly ? '/سنة' : '/شهر';

    // Update modal content
    const modal = qs('#paymentModal');
    if(modal){
      qs('#selectedPlanName', modal).textContent = planName;
      qs('#selectedPlanPrice', modal).textContent = `$${planPrice}${period}`;

      const savings = qs('.savings', card);
      const savingsElement = qs('#selectedPlanSavings', modal);
      if(savings && isYearly){
        savingsElement.textContent = savings.textContent;
        savingsElement.style.display = 'block';
      } else {
        savingsElement.style.display = 'none';
      }

      // Show modal
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  });
});

// Payment method selection
qsa('.payment-option').forEach(option=>{
  option.addEventListener('click', ()=>{
    // Remove active class from all options
    qsa('.payment-option').forEach(opt => opt.classList.remove('selected'));
    // Add active class to clicked option
    option.classList.add('selected');

    // Show/hide payment forms
    const method = option.getAttribute('data-method');
    const cardForm = qs('#cardPaymentForm');

    if(method === 'card' && cardForm){
      cardForm.style.display = 'block';
    } else if(cardForm){
      cardForm.style.display = 'none';
    }
  });
});

// Portfolio filter functionality
const portfolioFilter = ()=>{
  const filterBtns = qsa('.filter-btn');
  const portfolioItems = qsa('.portfolio-item');

  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item=>{
        const category = item.getAttribute('data-category');

        if(filter === 'all' || category === filter){
          item.style.display = 'block';
          setTimeout(()=>{
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(()=>{
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
};

portfolioFilter();

// Portfolio modal functionality
const portfolioProjects = {
  ecommerce: {
    title: 'متجر الأناقة الرقمي',
    description: 'منصة تجارة إلكترونية متكاملة مع نظام إدارة المخزون وأنظمة دفع متعددة',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    features: ['نظام دفع آمن', 'إدارة المخزون', 'تتبع الطلبات', 'تقارير مبيعات', 'تطبيق جوال'],
    results: ['زيادة المبيعات 300%', '10,000+ مستخدم نشط', 'تقييم 4.8/5'],
    duration: '3 أشهر',
    client: 'شركة الأناقة للأزياء'
  },
  mobile: {
    title: 'تطبيق إدارة المهام الذكي',
    description: 'تطبيق جوال متقدم لإدارة المشاريع والمهام مع ميزات الذكاء الاصطناعي',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    tech: ['Flutter', 'Firebase', 'AI/ML', 'Push Notifications'],
    features: ['إدارة المهام الذكية', 'تعاون الفريق', 'تقارير الإنتاجية', 'تذكيرات ذكية'],
    results: ['تقييم 4.8 في App Store', '50,000+ تحميل', 'جائزة أفضل تطبيق إنتاجية'],
    duration: '4 أشهر',
    client: 'شركة الإنتاجية الذكية'
  },
  ai: {
    title: 'مساعد ذكي لخدمة العملاء',
    description: 'نظام دردشة متقدم بالذكاء الاصطناعي لتحسين تجربة خدمة العملاء',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    tech: ['Python', 'OpenAI GPT', 'NLP', 'TensorFlow', 'Docker'],
    features: ['فهم اللغة الطبيعية', 'ردود ذكية', 'تعلم مستمر', 'تكامل متعدد المنصات'],
    results: ['تقليل وقت الاستجابة 70%', 'رضا العملاء 95%', 'جائزة الابتكار التقني'],
    duration: '6 أشهر',
    client: 'مجموعة الاتصالات المتقدمة'
  }
};

qsa('[data-bs-target="#portfolioModal"]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const project = btn.getAttribute('data-project');
    const projectData = portfolioProjects[project];

    if(projectData){
      const modalContent = qs('#portfolioModalContent');
      modalContent.innerHTML = `
        <div class="row g-0">
          <div class="col-lg-6">
            <img src="${projectData.image}" class="img-fluid h-100 object-cover" alt="${projectData.title}">
          </div>
          <div class="col-lg-6 p-4">
            <h3 class="text-gradient mb-3">${projectData.title}</h3>
            <p class="text-white-50 mb-4">${projectData.description}</p>

            <div class="mb-4">
              <h5 class="mb-2">التقنيات المستخدمة:</h5>
              <div class="d-flex flex-wrap gap-2">
                ${projectData.tech.map(tech => `<span class="badge bg-primary">${tech}</span>`).join('')}
              </div>
            </div>

            <div class="mb-4">
              <h5 class="mb-2">الميزات الرئيسية:</h5>
              <ul class="list-unstyled">
                ${projectData.features.map(feature => `<li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>${feature}</li>`).join('')}
              </ul>
            </div>

            <div class="mb-4">
              <h5 class="mb-2">النتائج المحققة:</h5>
              <ul class="list-unstyled">
                ${projectData.results.map(result => `<li class="mb-1"><i class="bi bi-trophy text-warning me-2"></i>${result}</li>`).join('')}
              </ul>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="glass p-3 rounded-3 text-center">
                  <i class="bi bi-clock text-primary fs-4"></i>
                  <div class="mt-2">
                    <small class="text-white-50">مدة التنفيذ</small>
                    <div class="fw-bold">${projectData.duration}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="glass p-3 rounded-3 text-center">
                  <i class="bi bi-building text-primary fs-4"></i>
                  <div class="mt-2">
                    <small class="text-white-50">العميل</small>
                    <div class="fw-bold small">${projectData.client}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <a href="#contact" class="btn btn-primary" data-bs-dismiss="modal">
                <i class="bi bi-chat-dots me-1"></i>مشروع مشابه
              </a>
              <a href="#" class="btn btn-outline-light">
                <i class="bi bi-eye me-1"></i>عرض مباشر
              </a>
            </div>
          </div>
        </div>
      `;
    }
  });
});

// Team member contact functionality
qsa('.contact-btn').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const memberCard = btn.closest('.team-member-card');
    const memberName = qs('.member-name', memberCard).textContent;

    // Scroll to contact form and pre-fill
    const contactForm = qs('#contact');
    if(contactForm){
      contactForm.scrollIntoView({behavior: 'smooth'});

      setTimeout(()=>{
        const messageField = qs('textarea[name="message"]', contactForm);
        if(messageField){
          messageField.value = `أرغب في التواصل مع ${memberName} بخصوص مشروعي`;
          messageField.focus();
        }
      }, 1000);
    }
  });
});

// Enhanced contact form handling
const mainContactForm = qs('#mainContactForm');
if(mainContactForm){
  mainContactForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const submitBtn = qs('button[type="submit"]', mainContactForm);
    const btnText = qs('.btn-text', submitBtn);
    const btnLoading = qs('.btn-loading', submitBtn);

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(()=>{
      // Hide loading state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Show success modal
      const successModal = new bootstrap.Modal(qs('#successModal'));
      successModal.show();

      // Reset form
      mainContactForm.reset();
    }, 2000);
  });
}

// Booking form handling
const bookingForm = qs('#bookingForm');
if(bookingForm){
  // Set minimum date to today
  const dateInput = qs('input[name="date"]', bookingForm);
  if(dateInput){
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  bookingForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Simulate booking submission
    setTimeout(()=>{
      // Close booking modal
      const bookingModal = bootstrap.Modal.getInstance(qs('#bookingModal'));
      bookingModal.hide();

      // Show success modal with booking confirmation
      const successModal = qs('#successModal');
      qs('.success-icon i', successModal).className = 'bi bi-calendar-check-fill text-success';
      qs('h4', successModal).textContent = 'تم تأكيد الحجز!';
      qs('p', successModal).textContent = `تم حجز استشارتك بنجاح ليوم ${data.date} في ${data.time}. سنرسل لك رابط الاجتماع قريباً.`;

      const successModalInstance = new bootstrap.Modal(successModal);
      successModalInstance.show();

      // Reset form
      bookingForm.reset();
    }, 1500);
  });
}

// Chat widget functionality
const chatWidget = qs('#chatWidget');
const chatToggle = qs('#chatToggle');
const chatWindow = qs('#chatWindow');
const chatClose = qs('#chatClose');
const chatInput = qs('#chatInput');
const sendMessage = qs('#sendMessage');
const chatMessages = qs('#chatMessages');
const chatNotification = qs('.chat-notification');

let chatOpen = false;

const toggleChat = ()=>{
  chatOpen = !chatOpen;

  if(chatOpen){
    // Show chat window
    chatWindow.style.display = 'flex';
    setTimeout(() => {
      chatWindow.classList.add('show');
    }, 10);

    // Hide notification
    if(chatNotification) {
      chatNotification.style.display = 'none';
    }

    // Focus input after animation
    setTimeout(() => {
      if(chatInput) chatInput.focus();
    }, 300);
  } else {
    // Hide chat window
    chatWindow.classList.remove('show');
    setTimeout(() => {
      chatWindow.style.display = 'none';
    }, 300);
  }
};

const addMessage = (content, type = 'sent')=>{
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;

  const now = new Date();
  const timeString = now.toLocaleTimeString('ar-SA', {hour: '2-digit', minute: '2-digit'});

  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-time">${timeString}</div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const sendChatMessage = ()=>{
  const message = chatInput.value.trim();
  if(!message) return;

  addMessage(message, 'sent');
  chatInput.value = '';

  // Simulate response
  setTimeout(()=>{
    const responses = [
      'شكراً لك! سأتواصل معك قريباً لمناقشة مشروعك.',
      'هذا يبدو مشروعاً مثيراً! دعني أحضر لك عرضاً مفصلاً.',
      'ممتاز! سأحتاج بعض التفاصيل الإضافية. هل يمكنك ملء النموذج أدناه؟',
      'أقدر اهتمامك بخدماتنا. سأعود إليك خلال ساعة بمقترح مفصل.'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, 'received');
  }, 1000 + Math.random() * 2000);
};

if(chatToggle){
  chatToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleChat();
  });
}

if(chatClose){
  chatClose.addEventListener('click', toggleChat);
}

if(sendMessage){
  sendMessage.addEventListener('click', sendChatMessage);
}

if(chatInput){
  chatInput.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
      sendChatMessage();
    }
  });
}

// Start chat button
const startChatBtn = qs('#startChat');
if(startChatBtn){
  startChatBtn.addEventListener('click', ()=>{
    if(!chatOpen){
      toggleChat();
    }
    chatInput.value = 'مرحباً، أرغب في مناقشة مشروع جديد';
    sendChatMessage();
  });
}

// Working hours status
const updateWorkingStatus = ()=>{
  const currentStatus = qs('#currentStatus');
  if(!currentStatus) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();

  let isOpen = false;
  let statusText = '';

  if(day === 6){ // Saturday
    isOpen = false;
    statusText = 'مغلق - السبت';
  } else if(day === 5){ // Friday
    if(hour >= 14 && hour < 18){
      isOpen = true;
      statusText = 'متاحون الآن';
    } else {
      isOpen = false;
      statusText = 'مغلق - خارج ساعات العمل';
    }
  } else { // Sunday to Thursday
    if(hour >= 9 && hour < 18){
      isOpen = true;
      statusText = 'متاحون الآن';
    } else {
      isOpen = false;
      statusText = 'مغلق - خارج ساعات العمل';
    }
  }

  currentStatus.className = `current-status mt-3 p-2 rounded-3 ${isOpen ? '' : 'closed'}`;
  qs('.status-text', currentStatus).textContent = statusText;
  qs('i', currentStatus).className = `bi bi-circle-fill ${isOpen ? 'text-success' : 'text-danger'} me-2`;
};

updateWorkingStatus();
setInterval(updateWorkingStatus, 60000); // Update every minute

// Form validation enhancements
const addFormValidation = (form)=>{
  const inputs = qsa('input[required], select[required], textarea[required]', form);

  inputs.forEach(input=>{
    input.addEventListener('blur', ()=>{
      validateField(input);
    });

    input.addEventListener('input', ()=>{
      if(input.classList.contains('is-invalid')){
        validateField(input);
      }
    });
  });
};

const validateField = (field)=>{
  const isValid = field.checkValidity();

  if(isValid){
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
  } else {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
  }

  return isValid;
};

// Apply validation to all forms
qsa('form').forEach(addFormValidation);

// Smooth scroll for all internal links
qsa('a[href^="#"]').forEach(link=>{
  link.addEventListener('click', (e)=>{
    const href = link.getAttribute('href');
    if(href === '#') return;

    const target = qs(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
});

// Add scroll-to-top button
const createScrollToTop = ()=>{
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, var(--primary), var(--primary-2));
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(78,169,255,.3);
  `;

  document.body.appendChild(scrollBtn);

  const toggleScrollBtn = ()=>{
    if(window.scrollY > 500){
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  };

  scrollBtn.addEventListener('click', ()=>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  window.addEventListener('scroll', toggleScrollBtn);
};

createScrollToTop();

