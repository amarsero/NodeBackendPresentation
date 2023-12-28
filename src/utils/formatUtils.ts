import { AddressInfo } from "net";

export function formatAddresInfo(addressInfo: string | AddressInfo | null) {
	if (!addressInfo) {
		return;
	}
	const formatted = (typeof addressInfo === "string") ?
		`${addressInfo}` :
		`http://${addressInfo.address}:${addressInfo.port}`;
	return formatted
		.replace("0.0.0.0", "127.0.0.1")
		.replace("::", "127.0.0.1");
}