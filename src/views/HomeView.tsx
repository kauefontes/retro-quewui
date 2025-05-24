import { useAppStore } from '../store/appStore';

export const HomeView = () => {
  const { setCurrentTab, theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  return (
    <div className={`flex flex-col h-full justify-center items-center p-4 ${
      isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'
    }`}>
      <section className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-2 ${
          isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'
        }`}>
          Quewui TUI
        </h1>
        <p className={`text-lg mb-6 ${
          isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'
        }`}>
          Senior Software Developer
        </p>
        <pre className={`block mb-6 text-xs leading-tight ${
          isDebianTheme ? 'text-white' : 'text-[var(--accent-color)]'
        }`}>
{`  ██████   ██    ██ ███████ ██     ██ ██    ██ ██ 
 ██    ██  ██    ██ ██      ██     ██ ██    ██ ██ 
 ██    ██  ██    ██ █████   ██  █  ██ ██    ██ ██ 
 ██ ▄▄ ██  ██    ██ ██      ██ ███ ██ ██    ██ ██ 
  ██████    ██████  ███████  ███ ███   ██████  ██ 
     ▀▀                                           `}
        </pre>
      </section>
      
      <section className="mb-6 w-full max-w-3xl">
        <p className={`text-center mb-4 ${
          isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'
        }`}>
          Welcome to my terminal-style website. Use the command line below or navigate with the following commands:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-auto">
          <CommandOption 
            command=":about" 
            description="Learn about me" 
            onClick={() => setCurrentTab('about')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":experiences" 
            description="View my experiences" 
            onClick={() => setCurrentTab('experiences')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":blog" 
            description="Read my blog posts" 
            onClick={() => setCurrentTab('blog')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":contact" 
            description="Get in touch" 
            onClick={() => setCurrentTab('contact')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":stats" 
            description=" " 
            onClick={() => setCurrentTab('stats')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":theme" 
            description="Toggle theme" 
            onClick={() => useAppStore.getState().toggleTheme()} 
            isDebianTheme={isDebianTheme}
          />
        </div>
      </section>
      
      <section className="text-center">
        <p className={`mb-2 ${isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'}`}>
          <kbd className={`px-2 py-1 mx-1 border border-solid ${
            isDebianTheme 
              ? 'bg-white/20 border-white rounded-none' 
              : 'bg-black/50 border-[var(--accent-color)] rounded'
          }`}>h</kbd> 
          <kbd className={`px-2 py-1 mx-1 border border-solid ${
            isDebianTheme 
              ? 'bg-white/20 border-white rounded-none' 
              : 'bg-black/50 border-[var(--accent-color)] rounded'
          }`}>j</kbd> 
          <kbd className={`px-2 py-1 mx-1 border border-solid ${
            isDebianTheme 
              ? 'bg-white/20 border-white rounded-none' 
              : 'bg-black/50 border-[var(--accent-color)] rounded'
          }`}>k</kbd> 
          <kbd className={`px-2 py-1 mx-1 border border-solid ${
            isDebianTheme 
              ? 'bg-white/20 border-white rounded-none' 
              : 'bg-black/50 border-[var(--accent-color)] rounded'
          }`}>l</kbd> 
          - Navigate like vim
        </p>
        <p className={`${isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'}`}>
          <kbd className={`px-2 py-1 mx-1 border border-solid ${
            isDebianTheme 
              ? 'bg-white/20 border-white rounded-none' 
              : 'bg-black/50 border-[var(--accent-color)] rounded'
          }`}>Tab</kbd> 
          - Navigate between elements
        </p>
      </section>
    </div>
  );
};

interface CommandOptionProps {
  command: string;
  description: string;
  onClick: () => void;
  isDebianTheme: boolean;
}

const CommandOption = ({ command, description, onClick, isDebianTheme }: CommandOptionProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 w-full border border-solid ${
        isDebianTheme 
          ? 'bg-white/10 border-[#666666] rounded-none text-white' 
          : 'bg-black/30 border-[var(--accent-color)] rounded text-[var(--text-color)]'
      }`}
    >
      <div className={`font-bold ${
        isDebianTheme ? 'text-white' : 'text-[var(--accent-color)]'
      }`}>{command}</div>
      <div className={`text-sm opacity-80 ${
        isDebianTheme ? 'text-white' : 'text-[var(--text-color)]'
      }`}>{description}</div>
    </button>
  );
};
