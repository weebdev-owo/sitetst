import styles from './faq.module.sass'
import { memo } from 'react'
import Image from 'next/image'
import {useState} from 'react'
import classNames from 'classnames'
import FadeUp from '/src/lib/fadeup'


const loreum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
const loreum2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const questions = [loreum2, loreum2, loreum2, loreum2, loreum2]
const answers = [loreum, loreum, loreum, loreum, loreum]
function FAQ({questions, answers}){
    return <>
        <div className={styles["heading"]}>{".Info."}</div>
        <FadeUp><Desc /></FadeUp>
        <div className={styles["questions"]}>
            {questions.map((question, i) =>{
                return <FadeUp key={i}><Question question={question} answer={answers[i]}/></FadeUp>
            })}
        </div>
    </>
}

FAQ = memo(FAQ)
FAQ.defaultProps = {
    questions, answers
}

function Question({question, answer}){
    const [open, setOpen] = useState(false)
    const question_css = classNames(styles["question-text"],{[styles['question-text-open']]: open})
    const answer_css = classNames(styles["answer-text"],{[styles['answer-text-open']]: open})
    const pointer_css = classNames(styles["pointer"], {[styles['pointer-open']]: open})
    return <>
        <div className={styles["question"]}>
            <div className={question_css} onClick={() => {setOpen(!open)}}>
                {question}
                <div className={pointer_css}>{`\u25BC`}</div>
            </div>
            <div className={answer_css}>{answer}</div>
        </div>
    </>
}

function Desc(){
    return <>
        {/* <div className={styles["sub-heading"]}>.Why Us.</div> */}
        <div className={styles.desc}>
            <div className={styles["desc-text"]}>{loreum}</div>
        </div>
    </>

}

export default FAQ