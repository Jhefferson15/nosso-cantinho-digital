class MomentsService {
    constructor() {
        this.moments = [
            { id: 1, imageUrl: 'assets/img/momentos/dia1.jpg', caption: 'Bom dia, meu amor!', likes: 0, comments: [] },
            { id: 2, imageUrl: 'assets/img/momentos/dia2.jpg', caption: 'O almoço de hoje!', likes: 0, comments: [] },
            { id: 3, imageUrl: 'assets/img/momentos/dia3.jpg', caption: 'Selfie no café', likes: 0, comments: [] }
        ];
    }

    getMoments() {
        return this.moments;
    }

    addMoment(imageUrl, caption) {
        const newMoment = {
            id: Date.now(),
            imageUrl: imageUrl,
            caption: caption,
            likes: 0,
            comments: []
        };
        this.moments.push(newMoment);
        return newMoment;
    }

    addLike(momentId) {
        const moment = this.moments.find(m => m.id === momentId);
        if (moment) {
            moment.likes++;
        }
        return moment;
    }

    addComment(momentId, commentText) {
        const moment = this.moments.find(m => m.id === momentId);
        if (moment) {
            moment.comments.push(commentText);
        }
        return moment;
    }
}

export const momentsService = new MomentsService();
