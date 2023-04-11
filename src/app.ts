import './style.css'
import { closest, distance } from 'fastest-levenshtein'
import pauseSvg from './pause.svg?raw'
import playSvg from './play.svg?raw'

export type SongData = {
	filename: string
	title: string
	offset?: number
	alternatives?: string[]
	siminarity?: number
}

const songs: SongData[] = []
let currentSong: SongData

const score = {
	correct: 0,
	incorrect: 0,
	skipped: 0,
}

const audio = document.createElement('audio')
const answerInput = document.getElementById('answer') as HTMLInputElement
const correctText = document.getElementById('correct') as HTMLSpanElement
const incorrectText = document.getElementById('incorrect') as HTMLSpanElement
const playPauseBtn = document.getElementById('play-pause') as HTMLButtonElement
const progressSlider = document.getElementById('progress') as HTMLInputElement
const progressTime = document.getElementById('progress-time') as HTMLInputElement
const titleText = document.getElementById('title') as HTMLSpanElement
const checkBtn = document.getElementById('check') as HTMLButtonElement
const nextBtn = document.getElementById('next') as HTMLButtonElement
const skipBtn = document.getElementById('skip') as HTMLButtonElement
const form = document.getElementById('form') as HTMLFormElement
const scoreCorrect = document.getElementById('score-correct') as HTMLSpanElement
const scoreIncorrect = document.getElementById('score-incorrect') as HTMLSpanElement
const scoreSkipped = document.getElementById('score-skipped') as HTMLSpanElement

audio.addEventListener('play', () => {
	playPauseBtn.innerHTML = pauseSvg
	playPauseBtn.classList.remove('loading')
})

audio.addEventListener('pause', () => {
	playPauseBtn.innerHTML = playSvg
	playPauseBtn.classList.remove('loading')
})

audio.addEventListener('loadedmetadata', () => {
	progressSlider.max = String(Math.floor(audio.duration))
})

audio.addEventListener('timeupdate', () => {
	if (audio.currentTime < (currentSong.offset ?? 0)) {
		audio.currentTime = currentSong.offset ?? 0
	}

	const mm = Math.floor((audio.currentTime - (currentSong.offset ?? 0)) / 60)
	const ss = Math.floor((audio.currentTime - (currentSong.offset ?? 0)) % 60)

	progressTime.innerText = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`
	progressSlider.value = String(audio.currentTime)
})

progressSlider.addEventListener('input', () => {
	audio.currentTime = Number(progressSlider.value)
})

playPauseBtn.addEventListener('click', () => {
	if (audio.paused) audio.play()
	else audio.pause()
})

skipBtn.addEventListener('click', () => {
	score.skipped++
	nextSong()
})

nextBtn.addEventListener('click', nextSong)

form.addEventListener('submit', e => {
	e.preventDefault()
	audio.pause()

	const answer = answerInput.value.toLowerCase()
	const answers = [currentSong.title, ...(currentSong.alternatives ?? [])].map(a => a.toLowerCase())
	const res = closest(answer, answers)

	if (distance(answer, res) / answer.length < (currentSong.siminarity ?? 3 / answer.length)) {
		correctText.classList.remove('hidden')
		incorrectText.classList.add('hidden')
		answerInput.classList.add('input-success')
		score.correct++
	} else {
		correctText.classList.add('hidden')
		incorrectText.classList.remove('hidden')
		answerInput.classList.add('input-error')
		score.incorrect++
	}

	titleText.innerText = currentSong.title

	answerInput.readOnly = true
	skipBtn.classList.add('hidden')
	checkBtn.classList.add('hidden')
	nextBtn.classList.remove('hidden')
	nextBtn.focus()
})

export default function prepareApp(songsData: SongData[]) {
	songs.push(...songsData)
	nextSong()
}

function nextSong() {
	currentSong = songs[Math.floor(Math.random() * songs.length)]
	audio.src = currentSong.filename
	audio.currentTime = currentSong.offset ?? 0

	progressSlider.min = String(currentSong.offset ?? 0)
	progressSlider.value = '0'
	progressTime.innerText = '00:00'

	answerInput.readOnly = false
	answerInput.value = ''
	answerInput.focus()
	answerInput.classList.remove('input-error')
	answerInput.classList.remove('input-success')

	correctText.classList.add('hidden')
	incorrectText.classList.add('hidden')

	skipBtn.classList.remove('hidden')
	checkBtn.classList.remove('hidden')
	nextBtn.classList.add('hidden')

	scoreCorrect.innerText = String(score.correct)
	scoreIncorrect.innerText = String(score.incorrect)
	scoreSkipped.innerText = String(score.skipped)

	titleText.innerText = ''
	// titleText.innerText = currentSong.title //! DEBUG

	audio.play().catch(() => (location.pathname = '/'))
}
