'use client';

import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { LucideArrowLeft, LucideLoader, LucideVideo } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { cn } from '@/utils/cn';
import { type VerificationStep } from './ui/onboarding-steps';

const MAX_VIDEO_TIME_IN_SECONDS = 60 as const;
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;

export default function VideoRecorder(props: {
  onClickNextStep: () => void;
  setFacecamBlobUrl: React.Dispatch<React.SetStateAction<string | null>>;
  verificationStep: VerificationStep;
  isActuallyLoading: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState<number>(MAX_VIDEO_TIME_IN_SECONDS);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('Processing');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [countDown, setCountDown] = useState(0);

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
    setSeconds(MAX_VIDEO_TIME_IN_SECONDS);
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
    <div className="flex h-full w-full flex-col gap-5 px-4 pb-8 pt-2 md:px-8 md:py-2">
      {/* <p className="absolute top-0 -ml-4 flex h-[60px] w-full flex-row justify-between md:-ml-8"></p> */}
      {completed ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 ">
          <div
            // initial={{ y: 20 }}
            // animate={{ y: 0 }}
            // transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
            className="relative flex w-full max-w-[1080px] flex-col items-center justify-center rounded-lg shadow-md  md:aspect-[16/9]"
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
          </div>
          <div className="flex w-full justify-between">
            <Button
              variant={'ghost'}
              onClick={() => retakeVideo()}
              className="px-4 py-2 transition-all duration-75 hover:bg-secondary active:scale-95 disabled:cursor-not-allowed"
            >
              <LucideArrowLeft size={16} className="mr-2" />
              Retake video
            </Button>

            <Button
              disabled={props.isActuallyLoading}
              variant="default"
              type="button"
              onClick={() => {
                const videoBlob = new Blob(recordedChunks, {
                  type: 'video/mp4',
                });

                const videoSizeInMB = videoBlob.size / 1024 / 1024;

                console.log({ videoSizeInMB });

                if (videoSizeInMB > MAX_VIDEO_FILE_SIZE) {
                  alert(
                    `Your video is too large. Please record a video under ${
                      MAX_VIDEO_FILE_SIZE / 1024 / 1024
                    } mb.`,
                  );
                  return;
                }

                const blobUrl = URL.createObjectURL(videoBlob);

                props.setFacecamBlobUrl(blobUrl);
                props.onClickNextStep();
              }}
            >
              {props.isActuallyLoading ? (
                <LucideLoader size={16} className="mr-2 animate-spin" />
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center">
          {recordingPermission ? (
            <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
              <div
                className={
                  'relative ' +
                  (isDesktop ? 'aspect-video' : 'aspect-[9/16]') +
                  ' w-full max-w-[1080px] overflow-hidden rounded-lg shadow-md'
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
                  <span className="absolute left-5 top-5 z-50 inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                    {new Date(seconds * 1000).toISOString().slice(14, 19)}
                  </span>
                  <div
                    className={cn(
                      countDown !== 0 ? 'bg-slate-900/50 ' : '',
                      'absolute left-1/2 top-1/2 z-50 flex min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-md px-2.5 py-0.5 text-8xl font-medium text-white',
                    )}
                  >
                    {countDown !== 0 && countDown}
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
                    className="absolute left-0 top-0 z-10 h-full min-h-[100%] w-auto min-w-[100%] object-cover"
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
                <div
                  className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-5xl font-semibold text-white"
                  id="countdown"
                ></div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[1080px] flex-col justify-center">
              <div className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg shadow-md ring-1 md:aspect-[16/9]">
                <p className="max-w-3xl text-center text-lg font-medium text-white">
                  Camera permission is denied. We don{`'`}t store your attempts
                  anywhere, but we understand not wanting to give us access to
                  your camera. Try again by opening this page in an incognito
                  window {`(`}or enable permissions in your browser settings
                  {`)`}.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {cameraLoaded && (
        <div className=" flex w-full items-center justify-center">
          {recordedChunks.length > 0 ? (
            <>
              {!isSuccess && (
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  {!isSubmitting && (
                    <Button
                      variant={'secondary'}
                      onClick={restartVideo}
                      className="flex scale-100 items-center justify-center px-5 py-3 text-base no-underline transition-all duration-75 hover:bg-secondary active:scale-95"
                    >
                      <ReloadIcon className="mr-2" />
                      Record again
                    </Button>
                  )}
                  <Button
                    variant={'brand'}
                    onClick={handleDownload}
                    disabled={isSubmitting}
                    className="group flex scale-100 items-center justify-center text-base no-underline outline outline-white transition-all duration-75 hover:bg-brand hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    <span>
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-x-2">
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
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-x-2">
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
                        </span>
                      )}
                    </span>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="">
              <div className="flex flex-col items-center justify-center gap-2 lg:mt-4">
                {capturing ? (
                  <Button
                    id="stopTimer"
                    onClick={handleStopCaptureClick}
                    className="w-40 hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    Finish Recording
                  </Button>
                ) : (
                  <Button
                    id="startTimer"
                    disabled={countDown !== 0}
                    onClick={async () => {
                      setCountDown(3);
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      setCountDown(2);
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      setCountDown(1);
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      setCountDown(0);
                      handleStartCaptureClick();
                    }}
                    className={cn(
                      countDown !== 0 && 'disabled:cursor-progress',
                      'w-40 select-none hover:brightness-105 active:scale-95 ',
                    )}
                  >
                    {countDown === 0 ? (
                      <>
                        <LucideVideo size={16} className="mr-2" /> Start
                        Recording
                      </>
                    ) : (
                      'Starting . . .'
                    )}
                  </Button>
                )}

                <div className="w-12"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
