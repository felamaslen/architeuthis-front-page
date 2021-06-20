NAME 	:= docker.fela.space/architeuthis-front-page
TAG 	:= $$(git log -1 --pretty=%H)
IMG 	:= ${NAME}:${TAG}

build:
	npm run build

build.docker:
	docker build -t ${IMG} .

push:
	docker push ${IMG}

get_image:
	@echo ${IMG}
