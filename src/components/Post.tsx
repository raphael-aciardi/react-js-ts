import styles from "./Post.module.css";
import { Comment } from "./Comment";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";

interface Author{
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content{
    type: 'paragraph' | 'link';
    content: string;

}

interface PostType{
    id: number
    author: Author;
    publishedAt: Date;
    content: Content[];
}


interface PostProps{
    Post: PostType
}

export function Post({Post} : PostProps) {

    const [comments, setComments] = useState([
        "post muito legal"
    ])

    const [newCommentText, setNewCommentText] = useState("");

    const publishedAtFormatted = format(Post.publishedAt, "d de LLLL às HH:mmh", {
        locale: ptBR
    });

    const publishedDateRelativeToNow = formatDistanceToNow(Post.publishedAt, {
        locale: ptBR,
        addSuffix: true
    });

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Esse campo e obrigatório!');
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('');
        setNewCommentText(event.target.value);
    }

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault();
        setComments([...comments, newCommentText]);
        setNewCommentText('');
        
        
    }

    function deleteComment(commentToDelete : string) {
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment !== commentToDelete;
        });
        setComments(commentsWithoutDeletedOne);
    }

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <img
                        className={styles.avatar}
                        src={Post.author.avatarUrl}
                    />
                    <div className={styles.authorInfo}>
                        <strong>{Post.author.name}</strong>
                        <span>{Post.author.role}</span>
                    </div>
                </div>

                <time title={publishedAtFormatted} dateTime={Post.publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {Post.content.map(line => {
                    if (line.type === 'paragraph') {
                        return <p key={line.content}>{line.content}</p>;
                    } else if (line.type === 'link') {
                        return <p key={line.content}><a href="#">{line.content}</a></p>;
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>
                <textarea
                    name="comment"
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    placeholder="Deixe um comentário"
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                <footer>
                    <button type="submit">Comentar</button>
                </footer>
            </form>

           <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        (
                        <Comment 
                        key={comment} 
                        content={comment}
                        onDeleteComment={deleteComment}
                         />)
                    )
                })}
           </div>


        </article>
    );
}
