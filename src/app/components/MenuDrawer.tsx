import { X, Map, Navigation, Info, Languages } from 'lucide-react';
import { Language, t } from '../utils/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
}

export function MenuDrawer({ isOpen, onClose, language, onLanguageChange }: Props) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 animate-fade-in" onClick={onClose}>
      <div className="absolute top-20 right-4 bg-white rounded-2xl shadow-2xl w-72 border-2 border-gray-200 animate-fade-in"
        onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-xl">{t(language, 'menu')}</h3>
            <button onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { icon: Map,       key: 'interactiveMap',  desc: 'interactiveMapDesc'  },
              { icon: Navigation, key: 'pathFinder',     desc: 'pathFinderDesc'      },
              { icon: Info,       key: 'roomInformation',desc: 'roomInformationDesc' },
            ].map(({ icon: Icon, key, desc }) => (
              <div key={key} className="flex items-start gap-3 p-3 bg-[#FCE8E9] rounded-xl">
                <div className="bg-[#A82227] p-2 rounded-full flex-shrink-0">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t(language, key as any)}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{t(language, desc as any)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-200">
            <div className="flex items-start gap-3 p-3 bg-[#FCE8E9] rounded-xl mb-4">
              <div className="bg-[#A82227] p-2 rounded-full flex-shrink-0">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-2">{t(language, 'language')} / Valoda</p>
                <div className="flex gap-2">
                  {(['en', 'lv'] as const).map(lang => (
                    <button key={lang} onClick={() => onLanguageChange(lang)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${language === lang ? 'bg-[#A82227] text-white' : 'bg-white text-[#A82227] border border-[#A5968A] hover:bg-[#FCE8E9]'}`}>
                      {lang === 'en' ? 'English' : 'Latviešu'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">{t(language, 'version')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
