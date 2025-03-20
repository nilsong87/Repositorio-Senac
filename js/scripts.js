document.addEventListener('DOMContentLoaded', function () {
    // Simulação de um banco de dados em memória
    let users = [
        { username: "teste", password: "1234" } // Usuário de teste
    ];
    let projects = JSON.parse(localStorage.getItem('projects')) || []; // Carrega projetos do localStorage

    // Verifica se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Páginas que requerem login
    const restrictedPages = ['projects.html', 'add-project.html', 'project-detail.html'];

    // Verifica se a página atual requer login
    const currentPage = window.location.pathname.split('/').pop();
    if (restrictedPages.includes(currentPage)) {
        if (!isLoggedIn) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = 'index.html'; // Redireciona para a página inicial
        }
    }

    // Elementos do modal
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const projectsLink = document.getElementById('projectsLink');
    const project1Link = document.getElementById('project1Link');
    const project2Link = document.getElementById('project2Link');

    // Formulários e links de alternância
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const showLoginForm = document.getElementById('showLoginForm');

    // Comportamento do link "Projetos"
    if (projectsLink) {
        projectsLink.addEventListener('click', function (e) {
            if (!isLoggedIn) {
                e.preventDefault(); // Impede o redirecionamento padrão
                modal.style.display = 'block'; // Abre o modal de login
            }
            // Se o usuário estiver logado, o link redireciona normalmente para projects.html
        });
    }

    // Comportamento dos cards de destaque (apenas se não estiver logado)
    if (!isLoggedIn) {
        if (project1Link) {
            project1Link.addEventListener('click', function (e) {
                e.preventDefault();
                modal.style.display = 'block';
            });
        }

        if (project2Link) {
            project2Link.addEventListener('click', function (e) {
                e.preventDefault();
                modal.style.display = 'block';
            });
        }
    }

    // Fecha o modal ao clicar no botão de fechar
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Alternar entre login e registro
    if (showRegisterForm) {
        showRegisterForm.addEventListener('click', function (e) {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
        });
    }

    if (showLoginForm) {
        showLoginForm.addEventListener('click', function (e) {
            e.preventDefault();
            registerFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }

    // Lógica de autenticação
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Verifica se o usuário existe e a senha está correta
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                alert("Login bem-sucedido!");
                localStorage.setItem('isLoggedIn', 'true'); // Marca o usuário como logado
                modal.style.display = 'none'; // Fecha o modal
                window.location.href = 'projects.html'; // Redireciona para a página de projetos
            } else {
                alert("Usuário ou senha incorretos!");
            }
        });
    }

    // Lógica de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;

            // Verifica se o usuário já existe
            const userExists = users.some(u => u.username === newUsername);
            if (userExists) {
                alert("Usuário já registrado!");
            } else {
                // Adiciona o novo usuário ao "banco de dados"
                users.push({ username: newUsername, password: newPassword });
                alert("Registro bem-sucedido!");
                registerFormContainer.style.display = 'none';
                loginFormContainer.style.display = 'block';
            }
        });
    }

    // Botão de Logoff
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Sair';
    logoutButton.id = 'logoutButton';
    logoutButton.addEventListener('click', function () {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'index.html';
    });

    // Adiciona o botão de logoff ao header se o usuário estiver logado
    if (isLoggedIn) {
        const headerNav = document.querySelector('header nav');
        if (headerNav) {
            headerNav.appendChild(logoutButton); // Adiciona o botão ao final do nav
        }
    }

    // Filtro de projetos
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const year = document.getElementById('yearFilter').value;
            const course = document.getElementById('courseFilter').value;

            const filteredProjects = projects.filter(project => {
                return (!year || project.year === year) && (!course || project.course === course);
            });

            displayProjects(filteredProjects);
        });
    }

    // Exibição dos projetos
    const projectsList = document.querySelector('.projects-grid');
    if (projectsList) {
        displayProjects(projects); // Exibe todos os projetos inicialmente
    }

    function displayProjects(projectsToDisplay) {
        projectsList.innerHTML = ""; // Limpa a lista atual
        projectsToDisplay.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.innerHTML = `
                <h3>${project.name}</h3>
                <p><strong>Turma:</strong> ${project.class}</p>
                <p><strong>Curso:</strong> ${project.course}</p>
                <p><strong>Instrutor:</strong> ${project.instructor}</p>
                <p><strong>Turno:</strong> ${project.shift}</p>
                <p><strong>Descrição:</strong> ${project.description}</p>
                ${project.files ? project.files.map(file => `
                    <a href="${file.content}" download="${file.name}">Baixar ${file.name}</a>
                `).join('') : ''}
                <a href="project-detail.html?id=${project.name}">Ver Detalhes</a>
            `;
            projectsList.appendChild(projectElement);
        });

        // Se não houver projetos, exibe uma mensagem
        if (projectsToDisplay.length === 0) {
            projectsList.innerHTML = "<p>Nenhum projeto encontrado.</p>";
        }
    }

    // Página de detalhes do projeto
    const projectDetail = document.querySelector('.project-detail');
    if (projectDetail) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id'); // Obtém o ID do projeto da URL

        const project = projects.find(p => p.name === projectId);
        if (project) {
            projectDetail.innerHTML = `
                <h2>${project.name}</h2>
                <p><strong>Turma:</strong> ${project.class}</p>
                <p><strong>Curso:</strong> ${project.course}</p>
                <p><strong>Instrutor:</strong> ${project.instructor}</p>
                <p><strong>Turno:</strong> ${project.shift}</p>
                <p><strong>Descrição:</strong> ${project.description}</p>
                ${project.files ? project.files.map(file => `
                    <a href="${file.content}" download="${file.name}">Baixar ${file.name}</a>
                `).join('') : ''}
            `;
        } else {
            projectDetail.innerHTML = "<p>Projeto não encontrado.</p>";
        }
    }

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simulação de envio de mensagem
            alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`);
            contactForm.reset(); // Limpa o formulário
        });
    }

    // Formulário de Adicionar Projeto
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Coleta os dados do formulário
            const projectName = document.getElementById('projectName').value;
            const projectClass = document.getElementById('projectClass').value;
            const projectInstructor = document.getElementById('projectInstructor').value;
            const projectCourse = document.getElementById('projectCourse').value;
            const projectShift = document.getElementById('projectShift').value;
            const projectDescription = document.getElementById('projectDescription').value;
            const projectFiles = document.getElementById('projectFiles').files;

            // Verifica se o nome do projeto já existe
            const projectExists = projects.some(p => p.name === projectName);
            if (projectExists) {
                alert("Já existe um projeto com esse nome. Escolha outro nome.");
                return;
            }

            // Cria um array para armazenar os arquivos
            const filesArray = [];
            for (let i = 0; i < projectFiles.length; i++) {
                const file = projectFiles[i];
                const fileReader = new FileReader();
                fileReader.onload = function (e) {
                    filesArray.push({
                        name: file.name,
                        content: e.target.result
                    });

                    // Quando todos os arquivos forem lidos, salva o projeto
                    if (filesArray.length === projectFiles.length) {
                        const newProject = {
                            name: projectName,
                            class: projectClass,
                            instructor: projectInstructor,
                            course: projectCourse,
                            shift: projectShift,
                            description: projectDescription,
                            files: filesArray
                        };

                        // Adiciona o novo projeto ao array de projetos
                        projects.push(newProject);

                        // Salva no localStorage
                        localStorage.setItem('projects', JSON.stringify(projects));

                        alert("Projeto adicionado com sucesso!");
                        addProjectForm.reset(); // Limpa o formulário
                        window.location.href = 'projects.html'; // Redireciona para a página de projetos
                    }
                };
                fileReader.readAsDataURL(file); // Lê o arquivo como URL
            }

            // Se não houver arquivos, salva o projeto sem arquivos
            if (projectFiles.length === 0) {
                const newProject = {
                    name: projectName,
                    class: projectClass,
                    instructor: projectInstructor,
                    course: projectCourse,
                    shift: projectShift,
                    description: projectDescription,
                    files: []
                };

                // Adiciona o novo projeto ao array de projetos
                projects.push(newProject);

                // Salva no localStorage
                localStorage.setItem('projects', JSON.stringify(projects));

                alert("Projeto adicionado com sucesso!");
                addProjectForm.reset(); // Limpa o formulário
                window.location.href = 'projects.html'; // Redireciona para a página de projetos
            }
        });
    }
});