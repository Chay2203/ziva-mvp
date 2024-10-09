import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Inbox, Box, Settings, Brackets, BookDashed, ChevronDown, SquarePen, Link, Trash, MousePointer2, Search } from 'lucide-react';
import { debounce } from 'lodash';

export const DashBoard = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [hoveredEmail, setHoveredEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [pageToken, setPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const observer = useRef();
  const lastEmailElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchEmails(pageToken, searchQuery);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, pageToken, searchQuery]);

  useEffect(() => {
    fetchEmails(null, searchQuery);
  }, [searchQuery]);

  const fetchEmails = async (token = null, query = '') => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/emails?pageToken=${token || ''}&maxResults=50&q=${encodeURIComponent(query)}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setEmails(prevEmails => token ? [...prevEmails, ...data.emails] : data.emails);
        setPageToken(data.nextPageToken);
        setHasMore(!!data.nextPageToken);
      } else {
        console.error('Failed to fetch emails');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPageToken(null);
      setEmails([]);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const getHeaderValue = (headers, name) => {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const emailDate = new Date(dateString);
    const diffTime = Math.abs(now - emailDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

    if (diffDays === 0) {
      return emailDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      const options = { month: 'short', day: 'numeric' };
      return emailDate.toLocaleDateString('en-US', options);
    }
  };

  const getEmailBody = (email) => {
    if (email.payload.parts) {
      const htmlPart = email.payload.parts.find(part => part.mimeType === 'text/html');
      const textPart = email.payload.parts.find(part => part.mimeType === 'text/plain');
      if (htmlPart && htmlPart.body.data) {
        return atob(htmlPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      } else if (textPart && textPart.body.data) {
        return atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    } else if (email.payload.body.data) {
      return atob(email.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
    return '';
  };

  const toggleAccounts = () => {
    setIsAccountsOpen(!isAccountsOpen);
  };

  const Sidebar = () => (
    <div className="w-56 flex-shrink-0 bg-black shadow-md tracking-tight overflow-y-auto">
      <div className="pt-6">
        <div className="flex items-center">
          <button 
            className="bg-black text-white px-4 py-2 hover:text-purple-300 transition duration-200 flex justify-between items-center"
            onClick={toggleAccounts}
          >
            <span className="mr-2 ml-0.5">All accounts</span>
            <ChevronDown size={16} className={`transform transition-transform duration-200 ${isAccountsOpen ? 'rotate-180' : ''}`} />
          </button>
          <button> 
            <SquarePen className="ml-10" size={20} />
          </button>
        </div>
        {isAccountsOpen && (
          <div className="bg-black py-4 p-2">
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Naga Chaitanya</a>
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Deepika Simhadri</a>
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Add Account</a>
          </div>
        )}
      </div>
      <nav className="mt-4 pr-2">
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <Inbox className="mr-2 text-purple-300" size={20} />
          Inbox
        </a>
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <Box className="mr-2 text-purple-300" size={20} />
          Tray
        </a>
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <MousePointer2 className="mr-2 text-purple-300" size={20} />
          Sent
        </a>
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <Brackets className="mr-2 text-purple-300" size={20} />
          Snippets
        </a>
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <BookDashed className="mr-2 text-purple-300" size={20} />
          Drafts
        </a>
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <Trash className="mr-2 text-purple-300" size={20} />
          Trash
        </a>
        <a href="/dashboard" className="flex items-center px-4 py-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-white hover:bg-opacity-20 bg-opacity-50 transition duration-200">
          <Settings className="mr-2 text-purple-300" size={20} />
          Settings
        </a>
      </nav>
    </div>
  );

  const Rapport = ({ selectedEmail }) => {
    const [summary, setSummary] = useState('');

    useEffect(() => {
      const fetchSummary = async () => {
        if (selectedEmail) {
          const body = getEmailBody(selectedEmail);
          try {
            const response = await fetch('NENU_API_ENDPOINT_ADD_CHEYYALI', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ emailBody: body }),
            });
            const data = await response.json();
            setSummary(data.summary); 
          } catch (error) {
            console.error('Error fetching summary:', error);
          }
        }
      };
      fetchSummary();
    }, [selectedEmail]);

    if (!selectedEmail) {
      return (
        <div className="w-64 flex-shrink-0 bg-black bg-opacity-75 text-white p-4 font-helvetica tracking-tight">
          <p className="text-gray-400 pt-2">Hover over an email to see details</p>
        </div>
      );
    }
    const from = getHeaderValue(selectedEmail.payload.headers, 'From');
    const emailAddress = from.match(/<(.+)>/)?.[1] || from;
    const name = from.split('<')[0].trim();
    return (
      <div className="w-64 flex-shrink-0 bg-black bg-opacity-75 text-white pl-4 pt-8 tracking-tight font-helvetica overflow-y-auto">
        <span className='tracking-extra-tight font-bold'><h2 className="text-xl mb-10">{name}</h2></span>
        <p className="text-gray-300 mb-4 text-xs">{emailAddress}</p>
        <div>
          <h3 className="text-sm font-bold mb-2 flex items-center">
            <a 
              href={`https://${emailAddress.split('@')[1]}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-purple-300 hover:underline"
            >
              <Link className="mr-2" size={16} />
              {emailAddress.split('@')[1]}
            </a>
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black font-helvetica text-white">
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-zinc-800 bg-opacity-90 shadow-sm w-full rounded-t-xl mt-5">
          <div className="flex items-center px-4 py-3 justify-between">
            <div className="flex space-x-4">
              <button className="text-gray-400 tracking-tight hover:text-white transition-colors duration-200">Important</button>
              <button className="text-gray-400 tracking-tight hover:text-white transition-colors duration-200">Calendar</button>
              <button className="text-gray-400 tracking-tight hover:text-white transition-colors duration-200">Newsletter</button>
              <button className="text-gray-400 tracking-tight hover:text-white transition-colors duration-200">Other</button>
            </div>
            <div className="flex items-center space-x-4">
            <div className="relative">
            <input
              type="text"
              className="bg-gray-700 text-white rounded-full pl-10 pr-4 py-1 focus:outline-none focus:ring-1 focus:ring-purple-300"
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
            </div>
          </div>
        </header>

        {/* Email list and detail view */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email list */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {loading && emails.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <table className="w-full bg-zinc-800 bg-opacity-90 table-fixed">
                <tbody>
                  {emails.map((email, index) => {
                    const from = getHeaderValue(email.payload.headers, 'From');
                    const subject = getHeaderValue(email.payload.headers, 'Subject');
                    const date = getHeaderValue(email.payload.headers, 'Date');
                    const formattedDate = formatDate(date);

                    return (
                      <tr
                        key={email.id}
                        ref={index === emails.length - 1 ? lastEmailElementRef : null}
                        className={`hover:bg-gray-800 cursor-pointer transition duration-200 ${
                          hoveredEmail === email ? 'bg-gray-800' : ''
                        }`}
                        onMouseEnter={() => {
                          setSelectedEmail(email);
                          setHoveredEmail(email);
                        }}
                        onMouseLeave={() => {
                          setHoveredEmail(null);
                        }}
                      >
                        <td className="px-4 py-3 w-2/4">
                          <div className="text-xs font-medium text-white tracking-tight truncate">
                            {from.split('<')[0].trim()}
                          </div>
                        </td>
                        <td className="px-4 py-3 w-11/12">
                          <div className="flex items-center text-xs text-white">
                            <div className="flex-grow font-light truncate opacity-90">{subject}</div>
                            <div className="ml-4 text-gray-400 truncate max-w-[250px]">{email.snippet}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 w-1/5 text-right">
                          <div className="text-xs text-gray-400 truncate">
                            {formattedDate}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {loading && emails.length > 0 && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Rapport selectedEmail={selectedEmail} />
    </div>
  );
};