#===================================================================================================
FROM fedora:latest AS build

# Install dependencies
RUN dnf upgrade -y && dnf install -y \
    nodejs \
    && dnf clean all

# Install angular CLI
RUN npm install -g @angular/cli

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