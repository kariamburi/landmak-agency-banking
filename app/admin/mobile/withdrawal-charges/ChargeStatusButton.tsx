import ActionSubmitButton from "@/app/components/ActionSubmitButton";
import { updateWithdrawalChargeStatusAction } from "./actions";

export default function ChargeStatusButton({
    id,
    status,
}: {
    id: number;
    status: string;
}) {
    const active = String(status || "").toLowerCase() === "active";

    return (
        <form action={updateWithdrawalChargeStatusAction}>
            <input type="hidden" name="id" value={id} />
            <input
                type="hidden"
                name="status"
                value={active ? "inactive" : "active"}
            />

            <ActionSubmitButton
                text={active ? "Deactivate" : "Activate"}
                loadingText="..."
            />
        </form>
    );
}