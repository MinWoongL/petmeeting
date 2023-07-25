FROM openjdk:11-jdk
LABEL maintainer="dadada0228"
ARG JAR_FILE=build/libs/*.jar
ADD ${JAR_FILE} petmeeting-springboot.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/petmeeting-springboot.jar"]