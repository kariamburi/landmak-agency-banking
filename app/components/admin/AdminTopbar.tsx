export default function AdminTopbar() {
    return (
        <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-gray-700">
                        Landmak Digital Banking Platform
                    </h2>
                    <p className="text-xs text-gray-500">
                        Mobile App Banking, M-Pesa & Security Monitoring
                    </p>
                </div>

                <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    System Online
                </div>
            </div>
        </header>
    );
}