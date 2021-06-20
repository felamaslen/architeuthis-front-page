node {
  checkout scm
  result = sh(script: "git log -1 | grep '(wip)'", returnStatus: true)

  if (result == 0) {
    echo "Skipping commit"
  } else {
    script {
      IMAGE = sh(returnStdout: true, script: "make get_image").trim()
    }

    docker.withRegistry('https://docker.fela.space', 'docker.fela.space-registry') {
      stage('Build and push images') {
        script {
          sh 'make build.docker push'
        }
      }

      stage('Deploy') {
        if (env.BRANCH_NAME == "master") {
          sh './k8s/deploy.sh'
        }
      }
    }
  }
}
