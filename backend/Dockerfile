#===================================================================================================
FROM fedora:latest AS build

# Install dependencies
RUN dnf upgrade -y && dnf install -y \
    java-21-openjdk-devel \
    maven \
    && dnf clean all

COPY . /app
WORKDIR /app

RUN mvn clean package -DskipTests

FROM fedora:latest AS run

# Install dependencies
RUN dnf upgrade -y && dnf install -y \
    java-21-openjdk \
    && dnf clean all

COPY --from=build /app/target/*.jar /app.jar

CMD [ "java", "-jar", "/app.jar" ]

#===================================================================================================
FROM build AS dev

# Arguments
ARG USER
ARG UID

# Install dependencies
RUN dnf upgrade -y && dnf install -y \
    gawk \
    zsh \
    fzf \
    xsel \
    xclip \
    tree \
    tmux \
    helix \
    && dnf clean all

# Add non-root user
RUN useradd --uid ${UID} --gid users -m ${USER} -s /bin/zsh
USER ${USER}

# Setup zsh shell with Oh-My-Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

CMD [ "zsh" ]
