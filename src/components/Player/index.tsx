

import Image from 'next/image';
import {  useEffect, useRef, useState } from 'react'
import {  usePlayer } from '../../context/PlayerContext'
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';



export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)

  const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState, playNext, playPrevious,
  hasNext, hasPrevious, isLooping, toggleLoop, isShuffling, toggleShuffle, clearPlayerState} = usePlayer();

  useEffect(() => {
    if (!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;
    
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }
  
  function handleSeek( amount: number ){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function HandleEpisodeEnded(){
    if(hasNext){
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="playing now"/>

        <strong>Playing now</strong>
      </header>
      
      {
        episode ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />

            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (

          <div className={styles.emptyPlayer}>
            <strong>Choose a podcast to hear</strong>
          </div>
        )
      }
      

      <footer className={ !episode ? styles.empty: ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                onChange={handleSeek}
                max={episode.duration}
                value={progress}
                trackStyle={{background: '#04d361'}}
                railStyle={{ background: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            ) }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
          onEnded={HandleEpisodeEnded}
          src={episode.url}
          autoPlay 
          ref={audioRef}
          onPlay={ () => setPlayingState(true)}
          onPause={ () => setPlayingState(false)}
          loop={isLooping}
          onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1 } onClick={toggleShuffle} className={isShuffling? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="shuffle"/>
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Play Previous"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying ? 
            <img src="/pause.svg" alt="Play"/> 
            :
            <img src="/play.svg" alt="Play"/>}
            
          </button>
          <button type="button" disabled={!episode || !hasNext } onClick={playNext}>
            <img src="/play-next.svg" alt="Play next"/>
          </button>
          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : '' }>
            <img src="/repeat.svg" alt="Repeat"/>
          </button>
        </div>
      </footer>

    </div>
  )
}