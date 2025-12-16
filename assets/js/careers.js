/* ===================== CAREERS PAGE SCRIPTS ===================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. JOB DATA
    const jobData = [
        {
            title: "Azure Data Architect II",
            location: "Dallas, TX",
            type: "Full Time",
            duties: {
                intro: "Serve as a consultant engaged in the design, implementation, and management of data solutions using Azure Cloud services.",
                points: [
                    "Develop and maintain Azure Data Architecture and MS Fabric Architecture.",
                    "Design end-to-end data pipelines using DataLake House and Power BI.",
                    "Collaborate with data scientists and IT teams.",
                    "Implement data security and privacy measures.",
                    "Work with data governance teams to ensure regulatory compliance."
                ]
            },
            requirements: {
                intro: "Bachelor’s degree in Computer Science or related field.",
                points: [
                    "2+ years experience in data engineering and reporting.",
                    "1+ year data modeling with Microsoft Azure and Fabric technology suite."
                ]
            }
        },
        {
            title: "Senior SAP Consultant",
            location: "Bangalore, IN",
            type: "Contract",
            duties: {
                intro: "Lead SAP implementation projects for enterprise clients.",
                points: ["Configure modules according to business requirements.", "Train users and provide post-implementation support."]
            },
            requirements: {
                intro: "Bachelor's Degree in related field.",
                points: ["5+ Years experience in SAP FICO or MM."]
            }
        },
        {
            title: "AI & ML Engineer",
            location: "Remote / Hybrid",
            type: "Full Time",
            duties: {
                intro: "Build predictive models and AI-driven analytics solutions.",
                points: ["Develop NLP models for customer service automation.", "Optimize machine learning pipelines for scale."]
            },
            requirements: {
                intro: "Master's degree in Data Science.",
                points: ["Proficiency in Python, TensorFlow, and PyTorch.", "Experience with AWS SageMaker."]
            }
        }
    ];

    const container = document.getElementById('job-container');
    const paginationContainer = document.getElementById('pagination');
    const itemsPerPage = 5;
    let currentPage = 1;

    function renderJobs(page) {
        if (!container) return;
        container.innerHTML = '';

        if (jobData.length === 0) {
            container.innerHTML = `
                <div class="no-jobs-state">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: #cbd5e1; display: block; margin-bottom: 16px;">folder_off</span>
                    <h3 style="font-size: 20px; font-weight: 700; color: #111;">No Current Openings</h3>
                    <p style="color: #666;">We don't have any open positions right now. Please check back later.</p>
                </div>
            `;
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = jobData.slice(start, end);

        paginatedItems.forEach(job => {
            const item = document.createElement('div');
            item.className = 'job-accordion-item';

            const dutyPoints = job.duties.points.map(p => `<li>${p}</li>`).join('');
            const reqPoints = job.requirements.points.map(p => `<li>${p}</li>`).join('');

            // UPDATED HTML STRUCTURE TO MATCH THE 'GLOWING MASK' DESIGN
            item.innerHTML = `
                <div class="job-border-mask"></div>
                <div class="job-inner-card">
                    <div class="job-header">
                        <div class="job-main-info">
                            <h3>${job.title}</h3>
                            <div class="job-meta-tags">
                                <span class="job-tag"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                                <span class="job-tag"><i class="fas fa-briefcase"></i> ${job.type}</span>
                            </div>
                        </div>
                        <div class="job-toggle-icon"><i class="fas fa-chevron-down"></i></div>
                    </div>
                    <div class="job-content-wrapper">
                        <div class="job-content-inner">
                            <span class="job-section-title">Job Duties:</span>
                            <p>${job.duties.intro}</p>
                            <ul>${dutyPoints}</ul>
                            
                            <span class="job-section-title">Requirements:</span>
                            <p>${job.requirements.intro}</p>
                            <ul>${reqPoints}</ul>

                            <div class="job-footer">
                                <button class="job-apply-btn" onclick="openModal('modal-apply', '${job.title}')">
                                    Apply Now <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const header = item.querySelector('.job-header');
            const contentWrapper = item.querySelector('.job-content-wrapper');

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close others
                document.querySelectorAll('.job-accordion-item.active').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.job-content-wrapper');
                        if (otherContent) otherContent.style.height = '0px';
                    }
                });

                if (isOpen) {
                    item.classList.remove('active');
                    contentWrapper.style.height = '0px';
                } else {
                    item.classList.add('active');
                    contentWrapper.style.height = contentWrapper.scrollHeight + 'px';
                }
            });

            container.appendChild(item);
        });

        renderPagination(Math.ceil(jobData.length / itemsPerPage), page);
    }

    function renderPagination(totalPages, current) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${current === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.onclick = () => { if (current > 1) { currentPage--; renderJobs(currentPage); } };
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === current ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => { currentPage = i; renderJobs(currentPage); };
            paginationContainer.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${current === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => { if (current < totalPages) { currentPage++; renderJobs(currentPage); } };
        paginationContainer.appendChild(nextBtn);
    }

    renderJobs(currentPage);


    /* ===================== MODAL LOGIC ===================== */
    window.openModal = function (modalId, jobTitle = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (jobTitle && modalId === 'modal-apply') {
            const titleInput = document.getElementById('apply-position-title');
            if (titleInput) titleInput.value = jobTitle;
        }

        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.classList.add('no-scroll');
    }

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 300);
    }

    // Bind Close Buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.target);
        });
    });

    // Close on Backdrop Click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-backdrop')) {
                closeModal(modal.id);
            }
        });
    });

});