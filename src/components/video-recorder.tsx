'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function VideoRecorder(props: {
  onClickNextStep: () => void;
  setFacecamBlobUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState(60);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('Processing');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    if (!webcamRef.current?.stream) {
      return alert('camera not found');
    }
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef?.current.stream);
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable,
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (capturing) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      if (seconds === 0) {
        handleStopCaptureClick();
        setCapturing(false);
        setSeconds(0);
      }
    }
    return () => {
      clearInterval(timer);
    };
  });

  const handleDownload = async () => {
    if (recordedChunks.length) {
      setSubmitting(true);

      await new Promise((res) => setTimeout(res, 400));

      setStatus('Processing');
      setIsSuccess(true);
      setSubmitting(false);
      setCompleted(true);
    }
  };

  function restartVideo() {
    setRecordedChunks([]);
    setCapturing(false);
    setSeconds(150);
  }

  function retakeVideo() {
    setSubmitting(false);
    setIsSuccess(false);
    setCompleted(false);
    restartVideo();
  }

  const videoConstraints = isDesktop
    ? { width: 1280, height: 720, facingMode: 'user' }
    : { width: 480, height: 640, facingMode: 'user' };

  const handleUserMedia = () => {
    setTimeout(() => {
      setLoading(false);
      setCameraLoaded(true);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {
        <div className="relative flex w-full flex-col overflow-x-hidden bg-[#FCFCFC] px-4 pb-8 pt-2 md:px-8 md:py-2">
          <p className="absolute top-0 -ml-4 flex h-[60px] w-full flex-row justify-between md:-ml-8"></p>
          {completed ? (
            <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-4 overflow-y-auto">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
                className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg bg-brand/20 shadow-md  md:aspect-[16/9]"
              >
                <video
                  className="h-full w-full rounded-lg"
                  controls
                  crossOrigin="anonymous"
                  autoPlay
                >
                  <source
                    src={URL.createObjectURL(
                      new Blob(recordedChunks, { type: 'video/mp4' }),
                    )}
                    type="video/mp4"
                  />
                </video>
              </motion.div>
              <div className="flex w-full justify-between">
                <button
                  onClick={() => retakeVideo()}
                  className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex w-fit items-center justify-center rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white no-underline  transition-all duration-75 active:scale-95  disabled:cursor-not-allowed"
                  style={{
                    boxShadow:
                      '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px , inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Retake video
                </button>

                <Button
                  variant="default"
                  type="button"
                  onClick={() => {
                    props.setFacecamBlobUrl(
                      URL.createObjectURL(
                        new Blob(recordedChunks, { type: 'video/mp4' }),
                      ),
                    );
                    props.onClickNextStep();
                  }}
                >
                  Submit Form
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center">
              {recordingPermission ? (
                <div className="mx-auto flex h-full w-full max-w-[1080px] flex-col justify-center">
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.075, 0.82, 0.965, 1],
                    }}
                    className={
                      'relative ' +
                      (isDesktop ? 'aspect-[16/9]' : 'aspect-[9/16]') +
                      ' w-full max-w-[1080px] overflow-hidden rounded-lg bg-brand/20 shadow-md'
                    }
                  >
                    {!cameraLoaded && (
                      <div className="absolute left-1/2 top-1/2 z-20 flex items-center text-white">
                        <svg
                          className="mx-auto my-0.5 h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth={3}
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}
                    <div className="relative z-10 h-full w-full rounded-lg">
                      <div className="absolute left-5 top-5 z-20 lg:left-10 lg:top-10">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                          {new Date(seconds * 1000).toISOString().slice(14, 19)}
                        </span>
                      </div>

                      <Webcam
                        mirrored
                        audio
                        muted
                        ref={webcamRef}
                        videoConstraints={videoConstraints}
                        onUserMedia={handleUserMedia}
                        onUserMediaError={(error) => {
                          console.error(`Error while recording:`, error);
                          setRecordingPermission(false);
                        }}
                        className="absolute z-10 h-full min-h-[100%] w-auto min-w-[100%] object-cover"
                      />
                    </div>
                    {loading && (
                      <div className="absolute flex h-full w-full items-center justify-center">
                        <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
                          <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
                            Loading...
                          </div>
                        </div>
                      </div>
                    )}
                    {cameraLoaded && (
                      <div className="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
                        {recordedChunks.length > 0 ? (
                          <>
                            {isSuccess ? (
                              <button
                                className="cursor-disabled group group inline-flex min-w-[140px] items-center justify-center rounded-full bg-green-500 px-4 py-2 text-[13px] text-sm font-semibold text-white duration-150 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
                                style={{
                                  boxShadow:
                                    '0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mx-auto h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </svg>
                              </button>
                            ) : (
                              <div className="flex flex-row gap-2">
                                {!isSubmitting && (
                                  <button
                                    onClick={() => restartVideo()}
                                    className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex scale-100 items-center justify-center gap-x-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black no-underline  transition-all duration-75 active:scale-95"
                                  >
                                    Restart
                                  </button>
                                )}
                                <button
                                  onClick={handleDownload}
                                  disabled={isSubmitting}
                                  className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex min-w-[140px] scale-100 items-center justify-center rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white no-underline  transition-all duration-75 active:scale-95  disabled:cursor-not-allowed"
                                  style={{
                                    boxShadow:
                                      '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px , inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)',
                                  }}
                                >
                                  <span>
                                    {isSubmitting ? (
                                      <div className="flex items-center justify-center gap-x-2">
                                        <svg
                                          className="mx-auto h-5 w-5 animate-spin text-slate-50"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                        <span>{status}</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-x-2">
                                        <span>Review video submission</span>
                                        <svg
                                          className="h-5 w-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M13.75 6.75L19.25 12L13.75 17.25"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M19 12H4.75"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </span>
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="absolute bottom-[6px] left-5 right-5 md:bottom-5">
                            <div className="flex flex-col items-center justify-center gap-2 lg:mt-4">
                              {capturing ? (
                                <div
                                  id="stopTimer"
                                  onClick={handleStopCaptureClick}
                                  className="flex h-10 w-10 scale-100 cursor-pointer flex-col items-center justify-center rounded-full bg-transparent text-white ring-4  ring-white duration-75 hover:shadow-xl active:scale-95"
                                >
                                  <div className="h-5 w-5 cursor-pointer rounded bg-red-500"></div>
                                </div>
                              ) : (
                                <button
                                  id="startTimer"
                                  onClick={handleStartCaptureClick}
                                  className="flex h-8 w-8 scale-100 flex-col items-center justify-center rounded-full bg-red-500 text-white ring-4 ring-white ring-offset-2 ring-offset-gray-500 duration-75 hover:shadow-xl active:scale-95 sm:h-8 sm:w-8"
                                ></button>
                              )}
                              <div className="w-12"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-5xl font-semibold text-white"
                      id="countdown"
                    ></div>
                  </motion.div>
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-[1080px] flex-col justify-center">
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.075, 0.82, 0.165, 1],
                    }}
                    className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg bg-brand/20 shadow-md ring-1 md:aspect-[16/9]"
                  >
                    <p className="max-w-3xl text-center text-lg font-medium text-white">
                      Camera permission is denied. We don{`'`}t store your
                      attempts anywhere, but we understand not wanting to give
                      us access to your camera. Try again by opening this page
                      in an incognito window {`(`}or enable permissions in your
                      browser settings{`)`}.
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      }
    </AnimatePresence>
  );
}
