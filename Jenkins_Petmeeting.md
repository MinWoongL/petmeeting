# Petmeeting 젠킨스 이용 백/프론트 CI/CD 세팅

## 알아야 할 기본 명령어들

- EC2 우분투 환경에서 실행할때 sudo 붙여서 실행하시기 바랍니다.

1. 켜져있는 컨테이너 확인 : `docker ps`
2. 꺼진 컨테이너 포함 확인 : `docker ps -a`
3. 다운 받아져 있는 도커 이미지 리스트 : `docker images`
4. 도커 이미지 검색 : `docker search {image_name}`
5. 도커 이미지 가져오기 : `docker pull {image_name}:{tag}`
<!-- ## Dockerfile이 있는 폴더로 이동하여 경로를 default로 이미지 생성 -->
6. 도커 이미지 생성 : `docker build <option> {Dockerfile Dir Path}`
7. 도커 컨테이너 생성 : `docker create <option> {image_name} : {tag}`

8. 도커 컨테이너 실행 : `docker start <option> {container_name or id}`

9. 도커 RUN ( 이미지 pull, 컨테이너 실행 ) : `docker run <option> {image_name} : {tag} <command> <arg>`

## 옵션

- -d : 백그라운드 모드
- -p : 호스트와 컨테이너 포트포워딩 설정
- -v : 호스트와 컨테이너 디렉토리 연결 설정
- -e : 컨테이너 내에세 사용할 환경변수 설정
- --name : 컨테이너 이름 설정
- -i : 상호 입출력
- -t : tty 활성화 bash쉘 사용
- --it : -i, -t 옵션을 같이 사용
- --rm : 프로세스 종료시에 컨테이너 자동 제거
- --link : 컨테이너 연결
- restart : docker desktop을 실행시킬때마다 컨테이너의 자동 재실행 설정 여부
  - no : 컨테이너를 재시작 시키지 않음(default)
  - on-failure[:max-retries] : 컨테이너가 정상적으로 종료되지 않은 경우(exit code가 0이 아님)에만 재시작 max-retries를 지정하면 재시작 최대 시도횟수까지 재시작 시도
  - always : 컨테이너를 항상 재시작 exit code에 영향 받지 않음
  - unless-stopped : 컨테이너를 정지시키기 전까지 항상 재시작

## docker 컨테이너 내부 접속

- `docker exec -it {container_id} /bin/bash`

## 컨테이너 로그 확인

- `docker container logs -t {container_id}`

## 도커 컨테이너 종료

- `docker stop {container_id}`

## 도커 컨테이너 삭제

- `docker rm {container_id}`
- `docker rm -f {container_id}` : 강제 삭제

## Petmeeting 젠킨스 세팅법

- 결론을 세팅법에 적어두고 세팅하면서 일어났던 문제들과 해결책은 괄호 이용하여 작성
- 저는 독립적인 실행을 위해서 젠킨스를 컨테이너 안에서 돌렸음을 주지하고 읽어주세요. (컨테이너 없이 돌리면 이슈가 적긴 합니다.)

1. `sudo docker run --user root --name jenkins_final1243 --detach -p 8081:8080 -p 30051:30050 -v myvol123:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker plz2`

   - `--user root` : 최고 권한으로 실행 (Jenkins를 도커 컨테이너 안에서 돌려서 CI 시 문제 해결)
   - `--name <>` : 컨테이너 이름
   - `--detach` : 백그라운드에서 실행 ( -d 와 동일)
   - `-p` : 외부포트와 내부 포트 연결 설정
   - `-v ` : 볼륨 마운트 (컨테이너의 외부 저장소)
   - `myvol123:/var/jenkins_home` : 젠킨스 세팅 정보 저장한 저장소
   - `-v /var/run/docker.sock:/var/run/docker.sock ` : 도커 컨테이너 안에는 도커가 없기 때문에 문제를 해결하기 위한 DOOD (Docker out of docker) 해결법 DID ( Docekr in docker ) 해결도 가능

2. 젠킨스 웹으로 켜서 젠킨스 설정
3. 젠킨스 플러그인 다운로드 (node 사용시 node, jvm 사용 시 찾아서 다운로드)
4. 백엔드 프로젝트 만들기

   - pipeline script

```
    pipeline {
    agent any
    environment {
        repository = "dadada0228/petmeeting-springboot" //docker hub id and repository name

        dockerImage = ''
    }

    stages{
        stage('gitlab clone'){
            steps {
                git branch: 'develop_backend',
                credentialsId: '<임의의 값>',
                url: '<임의의 url>'
            }
        }

        stage('build') {
            steps {
                dir('springboot/') {
                    sh'''
                    chmod u+x gradlew
                    echo 'start bootJar'
                    ./gradlew clean bootJar
                    '''
                }
            }
        }

        stage('Find jar file') {
            steps {
                script {
                    dir('springboot/') {
                        jarFilePath = sh(script: 'find . -type f -name "*.jar"', returnStdout: true).trim()
                        echo "Found jar file at: ${jarFilePath}"
                    }
                }
            }
        }

        stage('Building our image') {
            steps {
                script {
                    dir('springboot/'){
                        dockerImage = docker.build "${repository}:${env.BUILD_NUMBER}", "-f Dockerfile ."
                    }
                }
            }
        }

        stage('Run container') {
            steps {
                script {
                    dir('develop/frontend/petmeeting/'){
                        // Image 저장을 위한 Volume 설정
                        def volumeMappings = [
                            "/home/ubuntu/images/member:/member",
                            "/home/ubuntu/images/shelter:/shelter",
                            "/home/ubuntu/images/board:/board",
                            "/home/ubuntu/images/regist:/regist",
                            "/home/ubuntu/images/dog:/dog"
                        ].join(' -v ')

                        sh "docker rm -f back_server1"
                        sh "docker run -d -p 5000:5000 -v ${volumeMappings} --name back_server1 ${dockerImage.id}"
                    }
                }
            }
        }

        stage('Cleanup Docker Images') {
            steps {
                sh '''
                    # Get the image tags sorted by tag number (assumes tags are integers)
                    IMAGE_TAGS=$(docker images --format "{{.Tag}}" dadada0228/petmeeting-springboot | sort -rn)

                    # Get the image with the largest tag number
                    LARGEST_TAG=$(echo "$IMAGE_TAGS" | head -n 1)

                    echo "Image with Largest Tag: $LARGEST_TAG"

                    # Loop over the image tags and delete the ones with smaller tag numbers
                    echo "$IMAGE_TAGS" | while read -r TAG; do
                        if [ "$TAG" != "$LARGEST_TAG" ]; then
                            echo "Removing image with tag: $TAG"
                            docker rmi "dadada0228/petmeeting-springboot:$TAG"
                        fi
                    done
                '''
            }
        }
    } // stages 블록의 끝
}


```

- 해당 백엔드 pipeline은 젠킨스 도커 내에서 빌드를 실행해보고(CI) 실행 성공 시 새로운 서버를 빌드하여 도커 이미지를 찍고 ( 원래는 도커 허브에 업로드 파트도 있었음) , 해당 이미지로 기존 컨테이너 죽이고 새로운 컨테이너 실행하는 방식으로 구현

- 구식인거 압니다 욕하지마세요 이때는 이게 최선이었어!!

5. 프론트엔드 pipeline 만들기

```
pipeline {
    agent any
    tools {
        nodejs 'node'
    }

    environment {
        repository = "pria1479/petmeeting_react"
        DOCKERHUB_CREDENTIALS = <임의의 크레덴셜>
        dockerImage = ''
    }

    stages {
        stage('gitlab clone') {
            steps {
                git branch: 'develop_frontend',
                credentialsId: '<임의의 인증 방식>',
                url: '<임의의 url>'
            }
        }

        stage('Check npm') {
           steps {
            sh 'echo $PATH'
            sh 'node -v'
           }
        }

        stage('Build React App') {
            steps {
                dir('develop/frontend/petmeeting/'){
                    sh 'npm install'
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('Building our image') {
            steps {
                script {
                    dir('develop/frontend/petmeeting/'){
                        dockerImage = docker.build "${repository}:${env.BUILD_NUMBER}", "-f Dockerfile ."
                    }
                }
            }
        }

        stage('Run container') {
            steps {
                script {
                    dir('develop/frontend/petmeeting/'){
                        sh 'docker rm -f front_server1'
                        sh "docker run -d -p 5442:5442 --name front_server1 ${dockerImage.id}"
                    }
                }
            }
        }


        stage('Cleanup Docker Images') {
            steps {
                sh '''
                    # Get the image tags sorted by tag number (assumes tags are integers)
                    IMAGE_TAGS=$(docker images --format "{{.Tag}}" pria1479/petmeeting_react | sort -rn)

                    # Get the image with the largest tag number
                    LARGEST_TAG=$(echo "$IMAGE_TAGS" | head -n 1)

                    echo "Image with Largest Tag: $LARGEST_TAG"

                    # Loop over the image tags and delete the ones with smaller tag numbers
                    echo "$IMAGE_TAGS" | while read -r TAG; do
                        if [ "$TAG" != "$LARGEST_TAG" ]; then
                            echo "Removing image with tag: $TAG"
                            docker rmi "pria1479/petmeeting_react:$TAG"
                        fi
                    done
                '''
            }
        }










    }
}








```
