import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router";
import logoImage from 'figma:asset/55130a9cc9a8f890dc08e580a5cf6dd0df0df413.png';

export function Footer() {
  return (
    <footer className="bg-[rgb(0,18,47)] text-slate-400 py-12 px-4" role="contentinfo">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" aria-label="Hana Health Home">
            <img 
              src={logoImage}
              alt="Hana Voice AI Logo" 
              className="h-8 mb-6 brightness-0 invert"
              width="120"
              height="32"
            />
          </Link>
          <p className="text-sm text-slate-500 mb-4">
            Voice AI infrastructure for healthcare.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com/hanahealth" target="_blank" rel="noopener noreferrer" aria-label="Follow Hana Health on Twitter" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://github.com/hanahealth" target="_blank" rel="noopener noreferrer" aria-label="Hana Health on GitHub" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/company/hanahealth" target="_blank" rel="noopener noreferrer" aria-label="Hana Health on LinkedIn" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
        
        <nav aria-label="Platform navigation">
          <h4 className="text-white font-medium mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/use-cases" className="hover:text-white transition-colors">Agent Catalogue</Link></li>
            <li><Link to="/timeline" className="hover:text-white transition-colors">Reasoning Engine</Link></li>
            <li><a href="#integrations" className="hover:text-white transition-colors">Integrations</a></li>
            <li><a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">SDK</a></li>
          </ul>
        </nav>

        <nav aria-label="Resources navigation">
          <h4 className="text-white font-medium mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
            <li><Link to="/research" className="hover:text-white transition-colors">Research</Link></li>
            <li><Link to="/state-of-ai" className="hover:text-white transition-colors">State of Voice AI</Link></li>
            <li><Link to="/use-cases" className="hover:text-white transition-colors">Use Cases</Link></li>
          </ul>
        </nav>
        
        <nav aria-label="Company navigation">
          <h4 className="text-white font-medium mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Partnerships</Link></li>
            <li><a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Book a Demo</a></li>
          </ul>
        </nav>
        
        <div>
          <h4 className="text-white font-medium mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Compliance</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Hana Voice AI. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}