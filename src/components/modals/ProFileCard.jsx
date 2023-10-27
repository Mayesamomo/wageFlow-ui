
export default function ProFileCard() {
  return (
    <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ">
      <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownDefaultButton">
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover-bg-gray-100 ">
            Settings
          </a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">
            Earnings
          </a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">
            Sign out
          </a>
        </li>
      </ul>
    </div>
  )
}
