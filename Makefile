NAME 	:= docker.fela.space/architeuthis-front-page
TAG 	:= $$(git log -1 --pretty=%H)
IMG 	:= ${NAME}:${TAG}

build.docker:
	@docker build -t ${IMG} .

push:
	@docker push ${IMG}

deploy:
	@./k8s/deploy.sh

get_image:
	@echo ${IMG}
