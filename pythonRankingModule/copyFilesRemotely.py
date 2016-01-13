#-------------------------------------------------------------------------------
# Name:
# Purpose:       This .py file copies files to remote using ssh and sftp
#
# Required libs: paramiko
# Editor:        konkonst
#
#-------------------------------------------------------------------------------
import paramiko#,scp

 
class SSHConnection(object): 
    #----------------------------------------------------------------------
    def __init__(self, host, username, password, port=22): #Initialize  connection
        self.sftp = None
        self.sftp_open = False
        # self.scp = None
        # self.scp_open = False  
        # open SSH Transport stream
        self.transport = paramiko.Transport((host, port)) 
        self.transport.connect(username=username, password=password) 

        # self.client = paramiko.SSHClient()
        # self.client.load_system_host_keys()
        # self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        # self.client.connect(host, port, username, password)
    #----------------------------------------------------------------------
    def _openSFTPConnection(self): #Opens SFTP connection
        if not self.sftp_open:
            self.sftp = paramiko.SFTPClient.from_transport(self.transport)
            self.sftp_open = True 
    #----------------------------------------------------------------------
    # def _openSCPConnection(self): #Opens SCP connection
    #     if not self.scp_open:
    #         self.scp = scp.SCPClient(self.client.get_transport())
    #         self.scp_open = True 
    #----------------------------------------------------------------------
    def sftpPut(self, local_path, remote_path=None): #Copy a file from the local host to the remote host
        self._openSFTPConnection()
        self.sftp.put(local_path, remote_path) 
    #----------------------------------------------------------------------
    # def schPut(self, local_path, remote_path=None): #Copy a file from the local host to the remote host
    #     self._openSCPConnection()
    #     self.scp.put(local_path, remote_path) 
    #----------------------------------------------------------------------
    def close(self): #Close SFTP connection and ssh connection
        if self.sftp_open:
            self.sftp.close()
            self.sftp_open = False            
        # if self.scp_open:
        #     self.scp.close()
        #     self.scp_open = False
        self.transport.close()
        # self.client.close()

if __name__ == "__main__":
 
    origin = '/home/konkonst/commRanking/ssh/random_file.txt'
    dst = '/home/konkonst/random_file.txt' 
    ssh = SSHConnection(host, username, pw)
    ssh.sftpPut(origin, dst)
    # ssh.schPut(origin, dst)
    ssh.close()
