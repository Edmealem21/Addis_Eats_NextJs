{session.role === "staff" && (
  <>
    <Link href="/admin" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
      Admin
    </Link>
    <Link href="/kitchen" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
      Kitchen
    </Link>
  </>
)}