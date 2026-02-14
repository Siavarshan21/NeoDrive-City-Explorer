'use client';

/**
 * SettingsMenu - Game settings panel for audio, controls, and graphics.
 * Can be shown from the main menu or from the pause menu.
 */

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsMenuProps {
  onClose: () => void;
}

/** Slider input for settings */
function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  displayValue?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-300 font-mono min-w-[140px]">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-neo-cyan h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-xs text-neo-cyan font-mono w-12 text-right">
        {displayValue ?? value.toFixed(1)}
      </span>
    </div>
  );
}

/** Toggle switch for settings */
function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-300 font-mono">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors ${
          value ? 'bg-neo-cyan' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const settings = useSettingsStore();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-neo-dark border border-neo-cyan/30 rounded-lg p-6 w-[420px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neo-cyan font-mono">SETTINGS</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-mono">
            [X]
          </button>
        </div>

        <div className="space-y-6">
          {/* Audio */}
          <Card title="Audio">
            <div className="space-y-3">
              <Slider
                label="Music Volume"
                value={settings.musicVolume}
                min={0} max={1} step={0.05}
                onChange={settings.setMusicVolume}
                displayValue={`${Math.round(settings.musicVolume * 100)}%`}
              />
              <Slider
                label="SFX Volume"
                value={settings.sfxVolume}
                min={0} max={1} step={0.05}
                onChange={settings.setSfxVolume}
                displayValue={`${Math.round(settings.sfxVolume * 100)}%`}
              />
            </div>
          </Card>

          {/* Controls */}
          <Card title="Controls">
            <div className="space-y-3">
              <Slider
                label="Mouse Sensitivity"
                value={settings.mouseSensitivity}
                min={0.1} max={2} step={0.1}
                onChange={settings.setMouseSensitivity}
              />
              <Toggle
                label="Invert Mouse Y"
                value={settings.invertMouseY}
                onChange={settings.setInvertMouseY}
              />
            </div>
          </Card>

          {/* Graphics */}
          <Card title="Graphics">
            <div className="space-y-3">
              <Slider
                label="Render Distance"
                value={settings.renderDistance}
                min={100} max={1000} step={50}
                onChange={settings.setRenderDistance}
                displayValue={`${settings.renderDistance}m`}
              />
              <Toggle
                label="Show FPS"
                value={settings.showFps}
                onChange={settings.setShowFps}
              />
            </div>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
          <Button variant="danger" size="sm" onClick={settings.resetDefaults}>
            Reset Defaults
          </Button>
          <Button size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
