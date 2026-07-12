const CrisisAlert = () => (
  <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4">
    <p className="text-red-700 font-semibold text-sm">
      💙 We're here for you.
    </p>
    <p className="text-red-600 text-sm mt-1">
      If you're feeling overwhelmed or in distress, please reach out:
    </p>

    <a
      href="tel:9152987821"
      className="text-red-500 underline text-sm font-medium mt-2 block"
    >
      📞 iCall: 9152987821
    </a>

    <a
      href="tel:18602662345"
      className="text-red-500 underline text-sm font-medium mt-1 block"
    >
      📞 Vandrevala Foundation: 1860-2662-345
    </a>
  </div>
)

export default CrisisAlert
