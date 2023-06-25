import { useState } from "react";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { useRouter } from 'next/router';

export default function Home() {
	const [userId, setUserId] = useState("");
	const [displayUserId, setDisplayUserId] = useState("");
	const router = useRouter();

	const onSuccess = (result: ISuccessResult) => {
		let uid = result.nullifier_hash;
		// This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
		console.log("You are in bruh!");
		console.log("success results:", result);
		setUserId(uid);
		setDisplayUserId(`${uid.substring(0, 6)}...${uid.substring(uid.length - 4)}`);
		router.push('/main');
	};

	const handleProof = async (result: ISuccessResult) => {
		console.log('proof result:', result);

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
		<div>
			{ !userId && (
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
					<IDKitWidget action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!} onSuccess={onSuccess} handleVerify={handleProof} app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!} credential_types={[CredentialType.Orb, CredentialType.Phone]}>
						{({ open }) => <button onClick={open}>Verify with World ID</button>}
					</IDKitWidget>
				</div>
			)}
			{ userId && (
				<label>{displayUserId}</label>
			)}
		</div>
	);
}
