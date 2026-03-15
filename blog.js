  lucide.createIcons();

        (function () {
            var loader = document.getElementById('loader');
            document.body.style.overflow = 'hidden';
            setTimeout(function () { loader.classList.add('hidden'); document.body.style.overflow = ''; }, 2200);
        })();

        (function () {
            var body = document.body, toggle = document.getElementById('theme-toggle'), icon = toggle.querySelector('[data-lucide]');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var savedTheme = localStorage.getItem('inkwell-theme');
            var isLight = savedTheme ? savedTheme === 'light' : !prefersDark;
            function setTheme(light) {
                if (light) { body.classList.add('light-mode'); icon.setAttribute('data-lucide', 'sun'); }
                else { body.classList.remove('light-mode'); icon.setAttribute('data-lucide', 'moon'); }
                lucide.createIcons();
            }
            setTheme(isLight);
            toggle.addEventListener('click', function () {
                isLight = !isLight;
                localStorage.setItem('inkwell-theme', isLight ? 'light' : 'dark');
                toggle.classList.add('rotating');
                setTimeout(function () { toggle.classList.remove('rotating'); }, 500);
                setTheme(isLight);
            });
        })();

        function navigateTo(pageId) {
            document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
            var target = document.getElementById('page-' + pageId);
            if (target) target.classList.add('active');
            document.querySelectorAll('[data-page]').forEach(function (el) {
                if (el.tagName === 'A') el.classList.toggle('active', el.getAttribute('data-page') === pageId);
            });
            document.getElementById('mobile-menu').classList.remove('open');
            document.getElementById('hamburger').classList.remove('open');
            document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(function () { AOS.refresh(); }, 100);
        }

        document.addEventListener('click', function (e) {
            var el = e.target.closest('[data-page]');
            if (el) { e.preventDefault(); navigateTo(el.getAttribute('data-page')); }
        });

        (function () {
            var btn = document.getElementById('hamburger'), menu = document.getElementById('mobile-menu');
            btn.addEventListener('click', function () {
                var open = menu.classList.toggle('open');
                btn.classList.toggle('open', open);
                btn.setAttribute('aria-expanded', String(open));
                btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
            });
        })();

        (function () {
            var header = document.getElementById('site-header'), scrolled = false;
            window.addEventListener('scroll', function () {
                var should = window.scrollY > 80;
                if (should !== scrolled) { header.classList.toggle('scrolled', should); scrolled = should; }
            }, { passive: true });
        })();

        (function () {
            var btn = document.getElementById('back-top'), visible = false;
            window.addEventListener('scroll', function () {
                var should = window.scrollY > 400;
                if (should !== visible) { btn.classList.toggle('visible', should); visible = should; }
            }, { passive: true });
            btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        })();

        document.addEventListener('click', function (e) {
            var chip = e.target.closest('.filter-chip[data-category]');
            if (!chip) return;
            var parent = chip.closest('.filter-scroll');
            if (!parent) return;
            parent.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            var category = chip.getAttribute('data-category');
            var section = chip.closest('section,.content-layout,#page-home,#page-articles');
            var grids = section ? section.querySelectorAll('.cards-grid') : document.querySelectorAll('.cards-grid');
            grids.forEach(function (grid) {
                grid.querySelectorAll('article[data-category]').forEach(function (card) {
                    card.style.display = (category === 'all' || card.getAttribute('data-category') === category) ? '' : 'none';
                });
            });
        });

        document.getElementById('newsletter-submit').addEventListener('click', function () {
            var input = document.getElementById('newsletter-email');
            var success = document.getElementById('newsletter-success');
            if (!input.value || !input.value.includes('@')) { input.style.borderColor = 'var(--color-accent)'; input.focus(); return; }
            this.disabled = true; this.textContent = '✓ Subscribed!'; success.classList.add('show'); lucide.createIcons();
        });

        document.getElementById('contact-submit').addEventListener('click', function () {
            var name = document.getElementById('contact-name').value;
            var email = document.getElementById('contact-email').value;
            var msg = document.getElementById('contact-msg').value;
            var success = document.getElementById('contact-success');
            if (!name || !email || !msg) {
                [document.getElementById('contact-name'), document.getElementById('contact-email'), document.getElementById('contact-msg')].forEach(function (el) { if (!el.value) el.style.borderColor = 'var(--color-accent)'; });
                return;
            }
            this.disabled = true; this.innerHTML = '<span>Message Sent!</span>'; success.classList.add('show'); lucide.createIcons();
        });

        (function () {
            var canvas = document.getElementById('hero-canvas'), ctx = canvas.getContext('2d');
            var W, H, particles = [], mouseX = 0, mouseY = 0;
            var AMBER = 'rgba(245,158,11,', BLUE = 'rgba(100,140,200,';
            function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
            resize();
            window.addEventListener('resize', resize);
            window.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });
            function Particle() { this.reset(true); }
            Particle.prototype.reset = function (fresh) {
                this.x = Math.random() * W;
                this.y = fresh ? Math.random() * H : H + 20;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.5 + 0.2);
                this.life = 0; this.maxLife = 200 + Math.random() * 400;
                this.r = Math.random() * 1.8 + 0.5;
                this.amber = Math.random() > 0.4;
                this.twinkleOff = Math.random() * Math.PI * 2;
            };
            Particle.prototype.update = function () {
                this.life++; this.x += this.vx; this.y += this.vy;
                var dx = this.x - mouseX, dy = this.y - mouseY, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) { this.vx += (dx / dist) * 0.018; this.vy += (dy / dist) * 0.018; }
                this.vx *= 0.995; this.vy *= 0.995;
                if (this.life > this.maxLife) this.reset(false);
            };
            Particle.prototype.alpha = function () {
                var t = this.life / this.maxLife;
                var fade = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
                return fade * (0.6 + 0.4 * Math.sin(this.life * 0.06 + this.twinkleOff));
            };
            Particle.prototype.draw = function () {
                var a = this.alpha();
                ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = (this.amber ? AMBER : BLUE) + a + ')'; ctx.fill();
            };
            function InkBlob() {
                this.x = Math.random() * W; this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
                this.r = 60 + Math.random() * 120; this.phase = Math.random() * Math.PI * 2; this.amber = Math.random() > 0.5;
            }
            InkBlob.prototype.update = function () {
                this.x += this.vx; this.y += this.vy;
                if (this.x < -200) this.x = W + 200; if (this.x > W + 200) this.x = -200;
                if (this.y < -200) this.y = H + 200; if (this.y > H + 200) this.y = -200;
                this.phase += 0.006;
            };
            InkBlob.prototype.draw = function () {
                var pulse = 1 + 0.15 * Math.sin(this.phase);
                var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * pulse);
                var col = this.amber ? '245,158,11' : '80,110,180';
                grad.addColorStop(0, 'rgba(' + col + ',0.04)');
                grad.addColorStop(0.5, 'rgba(' + col + ',0.015)');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath(); ctx.arc(this.x, this.y, this.r * pulse, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
            };
            var count = Math.min(120, Math.floor(800 * 600 / 8000));
            for (var i = 0; i < count; i++)particles.push(new Particle());
            var blobs = []; for (var j = 0; j < 6; j++)blobs.push(new InkBlob());
            function drawLines() {
                var MAX = 110;
                for (var a = 0; a < particles.length; a++) {
                    for (var b = a + 1; b < particles.length; b++) {
                        var p = particles[a], q = particles[b];
                        var dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
                        if (d < MAX) {
                            var alpha = (1 - (d / MAX)) * 0.08 * Math.min(p.alpha(), q.alpha());
                            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                            ctx.strokeStyle = 'rgba(245,158,11,' + alpha + ')'; ctx.lineWidth = 0.5; ctx.stroke();
                        }
                    }
                }
            }
            var last = 0;
            function animate(ts) {
                if (ts - last < 16) { requestAnimationFrame(animate); return; }
                last = ts; ctx.clearRect(0, 0, W, H);
                blobs.forEach(function (b) { b.update(); b.draw(); });
                drawLines();
                particles.forEach(function (p) { p.update(); p.draw(); });
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        })();

        (function () {
            var el = document.querySelector('[data-parallax]');
            if (!el) return;
            var strength = parseFloat(el.dataset.parallax);
            window.addEventListener('scroll', function () { el.style.transform = 'translateY(' + (window.scrollY * strength) + 'px)'; }, { passive: true });
        })();

        (function () {
            var btn = document.getElementById('btn-main');
            if (!btn) return;
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                btn.style.transform = 'scale(1.05) translate(' + ((e.clientX - cx) * 0.18) + 'px,' + ((e.clientY - cy) * 0.18) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                setTimeout(function () { btn.style.transition = ''; }, 500);
            });
            btn.addEventListener('click', function () { btn.classList.remove('ripple'); void btn.offsetWidth; btn.classList.add('ripple'); });
        })();

        (function () {
            var container = document.getElementById('cursor-trail'), last = 0;
            window.addEventListener('mousemove', function (e) {
                var now = Date.now(); if (now - last < 30) return; last = now;
                var dot = document.createElement('div'), size = 3 + Math.random() * 4;
                dot.className = 'trail-dot';
                dot.style.cssText = 'left:' + (e.clientX - size / 2) + 'px;top:' + (e.clientY - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px;opacity:0.5;';
                container.appendChild(dot);
                setTimeout(function () { dot.remove(); }, 600);
            });
        })();

        document.querySelectorAll('.htag').forEach(function (tag) {
            tag.addEventListener('click', function () {
                document.querySelectorAll('.htag').forEach(function (t) { t.classList.remove('active'); });
                tag.classList.add('active');
            });
        });

        AOS.init({ duration: 700, easing: 'cubic-bezier(0.4,0,0.2,1)', once: true, offset: 60 });