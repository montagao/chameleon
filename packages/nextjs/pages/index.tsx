import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";

export default function Home() {
	const onSuccess = (result: ISuccessResult) => {
		let uid = result.nullifier_hash;

		localStorage.setItem('userId', uid);
		localStorage.setItem('scaffoldEth2.wallet', uid);
		localStorage.setItem('scaffoldEth2.burnerWallet.sk', uid);

		window.location.href = '/main';
	};

	const handleProof = async (result: ISuccessResult) => {
		const reqBody = {
			merkle_root: result.merkle_root,
			nullifier_hash: result.nullifier_hash,
			proof: result.proof,
			credential_type: result.credential_type,
			action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
			signal: "",
		};
		fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		}).then(async (res: Response) => {
			if (res.status == 200) {
				console.log("Successfully verified credential.")
			} else {
				throw new Error("Error: " + (await res.json()).code) ?? "Unknown error.";
			}
		});
	};

	return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
			<IDKitWidget action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!} onSuccess={onSuccess} handleVerify={handleProof} app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!} credential_types={[CredentialType.Orb, CredentialType.Phone]}>
				{({ open }) => <button onClick={open}>Verify with World ID</button>}
			</IDKitWidget>
		</div>
	);
}
