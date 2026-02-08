pipeline {
    agent any

   triggers {
    githubPush()
}


    environment {
        IMAGE_NAME = "foodnect-website"
        DOCKERHUB_USER = "ernesto1982"
        DOCKER_IMAGE = "${DOCKERHUB_USER}/${IMAGE_NAME}:latest"
        VPS_HOST = "5.189.141.128"
        VPS_DEPLOY_PATH = "/root/Foodnect"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/UANICODE/Foodnect-website.git',
                    credentialsId: 'github-acess'
                sh "ls -la"
            }
        }

        stage('Build & Push Docker') {
            steps {
                script {
                    sh "docker build --no-cache -t ${DOCKER_IMAGE} ."

                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        passwordVariable: 'DOCKER_PASSWORD', 
                        usernameVariable: 'DOCKER_USERNAME'
                    )]) {
                        sh """
                            echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin
                            docker push ${DOCKER_IMAGE}
                            docker logout
                        """
                    }
                }
            }
        }

        stage('Deploy to VPS') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'vps-password-access',
                    passwordVariable: 'VPS_PASSWORD',
                    usernameVariable: 'VPS_USERNAME'
                )]) {
                    sh """
                        sshpass -p \$VPS_PASSWORD ssh -o StrictHostKeyChecking=no root@${VPS_HOST} "
                            cd ${VPS_DEPLOY_PATH}
                            docker compose pull
                            docker compose up -d --force-recreate

                            if ! docker ps --filter 'name=foodnect-website' --format 'table {{.Names}}\\t{{.Status}}' | grep -q foodnect-website; then
                                echo '❌ Container foodnect-website não está rodando!'
                                docker logs foodnect-website 2>/dev/null || echo 'Container não existe'
                                exit 1
                            fi

                            echo '✅ Site foodnect.uanicode.com deployed!'
                        "
                    """
                }
            }
        }
    }

    post {
        failure {
            emailext(
                subject: "❌ Falha no Build - ${env.JOB_NAME}",
                to: "info@uanicode.com",
                body: """
O build falhou!

➡ JOB: ${env.JOB_NAME}
➡ BUILD: ${env.BUILD_URL}

Verifique os logs do Jenkins para detalhes.
"""
            )
        }
    }
}
