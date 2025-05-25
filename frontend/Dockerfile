#===================================================================================================
FROM fedora:latest AS base

# Install dependencies
RUN dnf upgrade -y && dnf install -y \
    nodejs \
    && dnf clean all
    
# Install angular CLI
RUN npm install -g @angular/cli

#===================================================================================================
FROM base AS build

COPY . /app
WORKDIR /app

# Build Angular app
RUN npm install
RUN ng build --configuration production

#===================================================================================================
FROM nginx:alpine AS run

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/user-management-system/browser /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

#===================================================================================================
FROM base AS dev

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