"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
// Iconos SVG inline para evitar dependencia de lucide-react
const PlayIcon = () => (
  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SquareIcon = () => (
  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9V9z" />
  </svg>
);

const VolumeIcon = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343l4.243 4.243m0 0l-4.243 4.243m4.243-4.243L6.343 6.343" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface Voice {
  name: string;
  lang: string;
  default?: boolean;
  voice: SpeechSynthesisVoice;
}

export default function TextToSpeechClient() {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);

  // Cargar voces disponibles
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceList: Voice[] = availableVoices.map((voice) => ({
        name: voice.name,
        lang: voice.lang,
        default: voice.default,
        voice,
      }));

      // Ordenar voces: primero las que coinciden con el idioma del navegador
      const browserLang = navigator.language;
      voiceList.sort((a, b) => {
        if (a.lang.startsWith(browserLang.split("-")[0])) return -1;
        if (b.lang.startsWith(browserLang.split("-")[0])) return 1;
        return a.name.localeCompare(b.name);
      });

      setVoices(voiceList);

      // Seleccionar voz por defecto
      if (voiceList.length > 0 && !selectedVoice) {
        const defaultVoice = voiceList.find((v) => v.default) || voiceList[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  // Dividir texto en palabras para resaltado
  useEffect(() => {
    if (text) {
      wordsRef.current = text.split(/\s+/).filter((word) => word.length > 0);
    }
  }, [text]);

  const handleSpeak = () => {
    if (!text.trim()) return;

    // Si está pausado, reanudar
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Si ya está reproduciendo, detener primero
    if (isPlaying) {
      window.speechSynthesis.cancel();
    }

    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configurar voz
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice.voice;
      }
    }

    // Configurar parámetros
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Eventos
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);
      setCurrentWordIndex(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(null);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
      setCurrentWordIndex(null);
      utteranceRef.current = null;
    };

    // Resaltar palabras mientras se leen
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const wordIndex = wordsRef.current.findIndex(
          (word, index) => {
            const textUpToWord = wordsRef.current.slice(0, index + 1).join(" ");
            return textUpToWord.length >= event.charIndex;
          }
        );
        if (wordIndex !== -1) {
          setCurrentWordIndex(wordIndex);
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(null);
    utteranceRef.current = null;
  };

  const handleDownload = () => {
    if (!text.trim()) return;

    // Crear un audio usando Web Speech API (limitado, pero funcional)
    // Nota: La API de síntesis de voz del navegador no permite descargar directamente
    // Esta es una implementación básica que muestra cómo se podría hacer
    alert(
      "La descarga de audio requiere una API de síntesis de voz en el servidor. Esta funcionalidad está en desarrollo."
    );
  };

  // Resaltar palabra actual
  const renderTextWithHighlight = () => {
    if (!text || currentWordIndex === null) return text;

    const words = text.split(/(\s+)/);
    let wordCount = 0;

    return words.map((part, index) => {
      if (part.trim()) {
        const isCurrent = wordCount === currentWordIndex;
        wordCount++;
        return (
          <span
            key={index}
            className={isCurrent ? "bg-yellow-200 dark:bg-yellow-900/30 rounded px-1 font-semibold" : ""}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeIcon />
            Text to Speech
          </CardTitle>
          <CardDescription>
            Convierte texto escrito en audio hablado. Ajusta la voz, velocidad, tono y volumen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Área de texto */}
          <div className="space-y-2">
            <label htmlFor="text-input" className="text-sm font-medium">
              Texto a convertir
            </label>
            <Textarea
              id="text-input"
              placeholder="Escribe o pega el texto que deseas convertir a voz..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-gray-600 dark:text-neutral-400">
              {text.length} caracteres • {wordsRef.current.length} palabras
            </p>
          </div>

          {/* Vista previa del texto con resaltado */}
          {text && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Vista previa</label>
              <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto">
                <p className="text-sm leading-relaxed text-gray-800 dark:text-neutral-200">{renderTextWithHighlight()}</p>
              </div>
            </div>
          )}

          {/* Controles de voz */}
          <div className="space-y-2">
            <label htmlFor="voice-select" className="text-sm font-medium">
              Voz
            </label>
            <Select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={voices.length === 0}
            >
              {voices.length === 0 ? (
                <option>Cargando voces...</option>
              ) : (
                voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang}) {voice.default ? "• Predeterminada" : ""}
                  </option>
                ))
              )}
            </Select>
          </div>

          {/* Controles de velocidad */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Velocidad</label>
              <span className="text-sm text-gray-600 dark:text-neutral-400">{rate.toFixed(1)}x</span>
            </div>
            <Slider
              min="0.5"
              max="2"
              step="0.1"
              value={rate.toString()}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Controles de tono */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tono</label>
              <span className="text-sm text-gray-600 dark:text-neutral-400">{pitch.toFixed(1)}</span>
            </div>
            <Slider
              min="0.5"
              max="2"
              step="0.1"
              value={pitch.toString()}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Controles de volumen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volumen</label>
              <span className="text-sm text-gray-600 dark:text-neutral-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <Slider
              min="0"
              max="1"
              step="0.1"
              value={volume.toString()}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Botones de control */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSpeak}
              disabled={!text.trim() || isLoading}
              className="flex-1 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <LoaderIcon />
                  Cargando...
                </>
              ) : isPaused ? (
                <>
                  <PlayIcon />
                  Reanudar
                </>
              ) : (
                <>
                  <PlayIcon />
                  Reproducir
                </>
              )}
            </Button>

            {isPlaying && (
              <Button onClick={handlePause} variant="outline" disabled={isPaused}>
                <PauseIcon />
                Pausar
              </Button>
            )}

            {(isPlaying || isPaused) && (
              <Button onClick={handleStop} variant="destructive">
                <SquareIcon />
                Detener
              </Button>
            )}

            <Button onClick={handleDownload} variant="outline" disabled={!text.trim()}>
              <DownloadIcon />
              Descargar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
